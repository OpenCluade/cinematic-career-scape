/**
 * Central, tunable visual and rendering parameters for the Layer 1 scene.
 * Keep every magic number here so the visual direction stays easy to adjust.
 */

export const sceneConfig = {
  /** Fixed camera for Layer 1. Camera motion arrives in Layer 3. */
  camera: {
    position: [7.5, 3.4, 12] as [number, number, number],
    lookAt: [0, 2.2, -6] as [number, number, number],
    fov: 42,
    near: 0.1,
    far: 160,
  },

  render: {
    dprCap: 1.5,
    dprCapReduced: 1,
    clearColor: "#0a0e16",
  },

  /** Exponential-squared fog: density is the only parameter it uses. */
  fog: {
    color: "#0a0e16",
    density: 0.022,
  },

  palette: {
    ground: "#10151f",
    monolith: "#161c28",
    monolithFar: "#121824",
    emissive: "#2fd4d0",
    emissiveSecondary: "#1d6f8c",
  },

  lighting: {
    ambientIntensity: 0.3,
    keyIntensity: 1.1,
    keyPosition: [9, 12, 6] as [number, number, number],
    rimIntensity: 1.6,
    rimPosition: [-11, 5, -12] as [number, number, number],
  },

  bloom: {
    intensity: 0.85,
    luminanceThreshold: 0.32,
    luminanceSmoothing: 0.5,
    mipmapBlur: true,
  },
} as const;
