import { useEffect, useState } from "react";

export type WebGL2Support = "unknown" | "supported" | "unsupported";

function detect(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    if (!context) return false;
    const lose = context.getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Explicit WebGL 2 capability check. Runs only in the browser, after mount,
 * so server and first client markup stay identical.
 */
export function useWebGL2Support(): WebGL2Support {
  const [support, setSupport] = useState<WebGL2Support>("unknown");

  useEffect(() => {
    setSupport(detect() ? "supported" : "unsupported");
  }, []);

  return support;
}
