import { Bloom, EffectComposer } from "@react-three/postprocessing";

import { sceneConfig } from "./scene-config";

/**
 * Bloom only. No vignette, depth of field or additional passes in Layer 1.
 * Rendered only when the "Reduce effects" preference is off.
 */
export function BloomEffects() {
  const { intensity, luminanceThreshold, luminanceSmoothing, mipmapBlur } = sceneConfig.bloom;

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={intensity}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={luminanceSmoothing}
        mipmapBlur={mipmapBlur}
      />
    </EffectComposer>
  );
}
