import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

interface Props {
  onContextLost: () => void;
  onContextRestored: () => void;
}

/**
 * WebGL context-loss handling.
 *
 * `preventDefault()` on `webglcontextlost` is what *permits* the browser to
 * restore the context later — it does not block recovery. Three.js keeps its
 * own listeners for renderer state; this component only mirrors the context
 * status into React so the interface can show a fallback, and it never
 * remounts or retries automatically.
 */
export function ContextEvents({ onContextLost, onContextRestored }: Props) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleLost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    const handleRestored = () => {
      onContextRestored();
      invalidate();
    };

    canvas.addEventListener("webglcontextlost", handleLost as EventListener);
    canvas.addEventListener("webglcontextrestored", handleRestored);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleLost as EventListener);
      canvas.removeEventListener("webglcontextrestored", handleRestored);
    };
  }, [gl, invalidate, onContextLost, onContextRestored]);

  return null;
}
