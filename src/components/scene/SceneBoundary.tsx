import { ClientOnly } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";

import { usePageVisibility } from "@/hooks/usePageVisibility";
import { useWebGL2Support, type WebGL2Support } from "@/hooks/useWebGL2Support";
import { useVisualPreferences } from "@/context/VisualPreferences";

import { SceneErrorBoundary } from "./SceneErrorBoundary";
import type { PortfolioCanvasProps } from "./PortfolioCanvasProps";

export type SceneStatus =
  | "loading"
  | "ready"
  | "unsupported"
  | "module-error"
  | "render-error"
  | "init-timeout"
  | "context-lost";

export const STATUS_MESSAGE: Record<SceneStatus, string | null> = {
  loading: "Loading the 3D environment…",
  ready: null,
  unsupported: "WebGL 2 is not available in this browser, so the 3D environment is disabled.",
  "module-error":
    "The 3D environment could not be downloaded. All content below remains available.",
  "render-error": "The 3D environment stopped unexpectedly. All content below remains available.",
  "init-timeout":
    "The 3D environment did not finish starting. All content below remains available.",
  "context-lost": "Graphics were interrupted by the browser. Content is unaffected.",
};

type CanvasModule = { default: ComponentType<PortfolioCanvasProps> };
export type CanvasLoader = () => Promise<CanvasModule>;

const defaultLoader: CanvasLoader = () => import("./PortfolioCanvas");

/** Milliseconds allowed for asynchronous renderer initialisation before giving up. */
export const INIT_TIMEOUT_MS = 12_000;

/** Simple tokenized background used whenever 3D is unavailable. */
function StaticBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_10%,var(--color-scene-glow)_0%,transparent_55%)] bg-background"
    />
  );
}

interface ViewProps {
  support: WebGL2Support;
  reduceEffects: boolean;
  pageVisible: boolean;
  loadCanvas?: CanvasLoader;
  initTimeoutMs?: number;
}

/**
 * Presentation-level boundary. Split from the hook wiring so the failure
 * classification and recovery behaviour can be exercised directly in tests.
 *
 * Failure classes are kept distinct:
 * - module download failure  -> caught on the dynamic import promise
 * - synchronous render error -> caught by SceneErrorBoundary
 * - async init never settles -> caught by the initialisation timeout
 * - WebGL context loss       -> reported by the canvas event listeners
 *
 * Recovery is always deliberate: a button press bumps a generation counter
 * which both resets the error boundary and recreates the Canvas. Nothing
 * retries on its own.
 */
export function SceneBoundaryView({
  support,
  reduceEffects,
  pageVisible,
  loadCanvas = defaultLoader,
  initTimeoutMs = INIT_TIMEOUT_MS,
}: ViewProps) {
  const [status, setStatus] = useState<SceneStatus>("loading");
  const [Canvas, setCanvas] = useState<ComponentType<PortfolioCanvasProps> | null>(null);
  // Bumped only by a deliberate recovery action. Section navigation never
  // touches it, so the Canvas element and its WebGL context are preserved.
  const [generation, setGeneration] = useState(0);
  const statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    if (support === "unsupported") setStatus("unsupported");
  }, [support]);

  // Manual dynamic import rather than React.lazy: lazy caches a rejected
  // import forever, so a retry would replay the same failure. Re-running this
  // effect issues a fresh import() for the retry.
  useEffect(() => {
    if (support !== "supported") return;
    let cancelled = false;
    setStatus("loading");
    setCanvas(null);
    loadCanvas()
      .then((module) => {
        if (!cancelled) setCanvas(() => module.default);
      })
      .catch((error) => {
        console.error("3D scene module failed to load", error);
        if (!cancelled) setStatus("module-error");
      });
    return () => {
      cancelled = true;
    };
  }, [support, generation, loadCanvas]);

  // Renderer creation is asynchronous and can fail without throwing into
  // React. If readiness never arrives, stop waiting and offer recovery.
  useEffect(() => {
    if (!Canvas || statusRef.current !== "loading") return;
    const timer = setTimeout(() => {
      if (statusRef.current === "loading") setStatus("init-timeout");
    }, initTimeoutMs);
    return () => clearTimeout(timer);
  }, [Canvas, generation, initTimeoutMs]);

  const handleReady = useCallback(() => setStatus("ready"), []);
  const handleContextLost = useCallback(() => setStatus("context-lost"), []);
  const handleContextRestored = useCallback(() => setStatus("ready"), []);
  const handleRenderError = useCallback(() => setStatus("render-error"), []);
  const recover = useCallback(() => {
    // Unmount the current Canvas in the same update that bumps the
    // generation. Without this the old element would first remount under the
    // new key and the loading effect would then mount a second one.
    setStatus("loading");
    setCanvas(null);
    setGeneration((value) => value + 1);
  }, []);

  const canRecover =
    status === "render-error" ||
    status === "context-lost" ||
    status === "module-error" ||
    status === "init-timeout";
  const showBackdrop = status !== "ready";
  const message = STATUS_MESSAGE[status];
  const mountCanvas = support === "supported" && Canvas !== null && status !== "module-error";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {showBackdrop && <StaticBackdrop />}

      {mountCanvas && Canvas && (
        <SceneErrorBoundary onError={handleRenderError} fallback={null} resetKey={generation}>
          <div aria-hidden="true" className="absolute inset-0" data-testid="scene-canvas-host">
            <Canvas
              key={generation}
              reduceEffects={reduceEffects}
              pageVisible={pageVisible}
              onReady={handleReady}
              onContextLost={handleContextLost}
              onContextRestored={handleContextRestored}
            />
          </div>
        </SceneErrorBoundary>
      )}

      {message && (
        <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-20 max-w-md md:right-auto">
          <p
            role="status"
            data-testid="scene-status"
            className="rounded-md border border-border/70 bg-surface/80 px-3 py-2 text-xs text-muted-foreground backdrop-blur"
          >
            {message}
            {canRecover && (
              <button
                type="button"
                onClick={recover}
                className="ml-2 rounded-sm font-medium text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Restore graphics
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Client-only mount for the browser-dependent scene.
 * Nothing here blocks the surrounding page.
 */
export function SceneBoundary() {
  const { reduceEffects } = useVisualPreferences();
  const pageVisible = usePageVisibility();
  const support = useWebGL2Support();

  return (
    <ClientOnly
      fallback={
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <StaticBackdrop />
        </div>
      }
    >
      <SceneBoundaryView
        support={support}
        reduceEffects={reduceEffects}
        pageVisible={pageVisible}
      />
    </ClientOnly>
  );
}
