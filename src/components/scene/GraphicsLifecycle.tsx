import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";

declare global {
  interface Window {
    /** Diagnostic counter: real scene frames drawn (used to verify idle rendering). */
    __portfolioSceneFrames?: number;
  }
}

interface Props {
  /** Any value that should trigger exactly one fresh frame when it changes. */
  qualityKey: string;
  pageVisible: boolean;
}

/**
 * Owns demand-rendering bookkeeping.
 *
 * The scene is static in Layer 1, so nothing here invalidates on a loop.
 * A frame is requested only when the scene is ready, the viewport changes,
 * or visual settings change. Work is suspended while the page is hidden.
 */
export function GraphicsLifecycle({ qualityKey, pageVisible }: Props) {
  const invalidate = useThree((state) => state.invalidate);
  const size = useThree((state) => state.size);
  const setFrameloop = useThree((state) => state.setFrameloop);

  // Diagnostic only: counts frames the scene actually draws. It does not
  // request frames, so it cannot keep the renderer awake.
  useFrame(() => {
    if (typeof window !== "undefined") {
      window.__portfolioSceneFrames = (window.__portfolioSceneFrames ?? 0) + 1;
    }
  });

  useEffect(() => {
    if (!pageVisible) {
      setFrameloop("never");
      return;
    }
    setFrameloop("demand");
    invalidate();
  }, [pageVisible, setFrameloop, invalidate]);

  useEffect(() => {
    if (pageVisible) invalidate();
  }, [qualityKey, size.width, size.height, pageVisible, invalidate]);

  return null;
}
