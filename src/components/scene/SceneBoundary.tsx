import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useCallback, useEffect, useState } from "react";

import { usePageVisibility } from "@/hooks/usePageVisibility";
import { useWebGL2Support } from "@/hooks/useWebGL2Support";
import { useVisualPreferences } from "@/context/VisualPreferences";

import { SceneErrorBoundary } from "./SceneErrorBoundary";

const PortfolioCanvas = lazy(() => import("./PortfolioCanvas"));

type SceneStatus =
  "loading" | "ready" | "unsupported" | "module-error" | "render-error" | "context-lost";

const STATUS_MESSAGE: Record<SceneStatus, string | null> = {
  loading: "Loading the 3D environment…",
  ready: null,
  unsupported: "WebGL 2 is not available in this browser, so the 3D environment is disabled.",
  "module-error":
    "The 3D environment could not be downloaded. All content below remains available.",
  "render-error": "The 3D environment stopped unexpectedly. All content below remains available.",
  "context-lost": "Graphics were interrupted by the browser. Content is unaffected.",
};

/** Simple tokenized background used whenever 3D is unavailable. */
function StaticBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_10%,var(--color-scene-glow)_0%,transparent_55%)] bg-background"
    />
  );
}

/**
 * Lazy, client-only mount for the browser-dependent scene.
 * Nothing here blocks the surrounding page.
 */
export function SceneBoundary() {
  const { reduceEffects } = useVisualPreferences();
  const pageVisible = usePageVisibility();
  const webgl2 = useWebGL2Support();
  const [status, setStatus] = useState<SceneStatus>("loading");
  // Only a deliberate user recovery action changes this key. Section
  // navigation never does, so the Canvas is preserved.
  const [canvasGeneration, setCanvasGeneration] = useState(0);

  useEffect(() => {
    if (webgl2 === "unsupported") setStatus("unsupported");
  }, [webgl2]);

  const handleReady = useCallback(() => setStatus("ready"), []);
  const handleContextLost = useCallback(() => setStatus("context-lost"), []);
  const handleContextRestored = useCallback(() => setStatus("ready"), []);
  const handleRenderError = useCallback(() => setStatus("render-error"), []);

  const canRecover = status === "render-error" || status === "context-lost";
  const showBackdrop = status !== "ready";
  const message = STATUS_MESSAGE[status];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {showBackdrop && <StaticBackdrop />}

      <ClientOnly fallback={null}>
        {webgl2 === "supported" && (
          <SceneErrorBoundary onError={handleRenderError} fallback={null}>
            <Suspense fallback={null}>
              <ModuleErrorWatcher onModuleError={() => setStatus("module-error")}>
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  data-testid="scene-canvas-host"
                >
                  <PortfolioCanvas
                    key={canvasGeneration}
                    reduceEffects={reduceEffects}
                    pageVisible={pageVisible}
                    onReady={handleReady}
                    onContextLost={handleContextLost}
                    onContextRestored={handleContextRestored}
                  />
                </div>
              </ModuleErrorWatcher>
            </Suspense>
          </SceneErrorBoundary>
        )}
      </ClientOnly>

      {message && (
        <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-20 max-w-md md:right-auto">
          <p
            role="status"
            className="rounded-md border border-border/70 bg-surface/80 px-3 py-2 text-xs text-muted-foreground backdrop-blur"
          >
            {message}
            {canRecover && (
              <button
                type="button"
                onClick={() => {
                  setStatus("loading");
                  setCanvasGeneration((generation) => generation + 1);
                }}
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
 * Suspense cannot report a failed lazy chunk download, so the module error
 * is surfaced through a dedicated boundary that reports and renders nothing.
 */
function ModuleErrorWatcher({
  children,
  onModuleError,
}: {
  children: React.ReactNode;
  onModuleError: () => void;
}) {
  return (
    <SceneErrorBoundary onError={onModuleError} fallback={null}>
      {children}
    </SceneErrorBoundary>
  );
}
