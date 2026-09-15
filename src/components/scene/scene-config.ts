/**
 * Central, tunable visual and rendering parameters for the architectural
 * gallery. Every magic number the scene uses lives here so the visual
 * direction stays easy to adjust without touching geometry code.
 *
 * Nothing in this file knows anything about CV content: content IDs are
 * mapped to camera destinations only from Layer 3 onwards.
 */

export type Vec3 = [number, number, number];

/** Width (canvas CSS pixels) below which the mobile camera pose is used. */
export const MOBILE_BREAKPOINT = 760;

export const sceneConfig = {
  /**
   * Two fixed poses. The camera never travels inside a layout; it only
   * switches pose when the responsive layout changes. Camera choreography
   * arrives in Layer 3.
   */
  camera: {
    near: 0.1,
    far: 220,
    desktop: {
      position: [0, 3.5, 15] as Vec3,
      lookAt: [-1.2, 3.1, -16] as Vec3,
      fov: 42,
    },
    mobile: {
      position: [3.2, 3.4, 10] as Vec3,
      lookAt: [3.5, 3.4, -16] as Vec3,
      fov: 52,
    },
  },

  render: {
    dprCap: 1.5,
    dprCapReduced: 1,
    clearColor: "#080b12",
  },

  /** Exponential-squared fog: density is the only parameter it uses. */
  fog: {
    color: "#080b12",
    density: 0.019,
  },

  /**
   * Small, deliberate material system. Differences come from colour and
   * roughness rather than from textures or reflections.
   */
  materials: {
    /** Matte blue-charcoal: the default architectural surface. */
    architecture: { color: "#1a2130", roughness: 0.88, metalness: 0.04 },
    /** Slightly lighter mineral: selected piers and the portal plinth. */
    mineral: { color: "#2b3446", roughness: 0.74, metalness: 0.05 },
    /** Dark metal: thin framing, insets and the portal frame. */
    metal: { color: "#0d1119", roughness: 0.36, metalness: 0.88 },
    /** Distant silhouettes, read mostly through fog. */
    distant: { color: "#151b27", roughness: 0.95, metalness: 0.02 },
    /** The floor. */
    floor: { color: "#121826", roughness: 0.82, metalness: 0.1 },
  },

  emissive: {
    color: "#3ee0da",
    /** Portal inner edge — the primary luminous shape. */
    portalIntensity: 2.4,
    /** Recessed floor guide lights — supporting, deliberately dimmer. */
    guideIntensity: 0.6,
  },

  lighting: {
    /** Broad key light separating the near architecture. */
    key: { position: [12, 16, 9] as Vec3, intensity: 1.35, color: "#93b6dc" },
    /** Restrained fill so dark surfaces keep tonal variation. */
    fill: { intensity: 0.42, color: "#6f86ab" },
    /** Rim light behind the gallery, separating midground from background. */
    rim: { position: [-13, 7, -34] as Vec3, intensity: 2.4, color: "#1f7fa0", distance: 90 },
    /** Local glow around the portal so it reads with Bloom disabled. */
    portal: { intensity: 7, color: "#3ee0da", distance: 26 },
  },

  bloom: {
    intensity: 0.5,
    luminanceThreshold: 0.45,
    luminanceSmoothing: 0.35,
    mipmapBlur: true,
  },

  /** Architectural layout. Positions are in world units along the -Z route. */
  architecture: {
    /** Centre line of the route into the gallery. */
    routeX: 3.6,
    floor: { size: 240, z: -40 },

    /** Two asymmetric foreground elements framing the view. */
    foreground: [
      { key: "fg-left", position: [-6.2, 6.4, 4.5] as Vec3, size: [2.4, 12.8, 2.6] as Vec3 },
      { key: "fg-right", position: [9.4, 2.1, 1.5] as Vec3, size: [3.2, 4.2, 3.4] as Vec3 },
    ],

    /** Midground piers: substantial, deliberately uneven spacing and height. */
    piers: [
      { key: "p-l1", x: -2.2, z: -2.5, height: 7.4, mineral: false },
      { key: "p-l2", x: -2.2, z: -8.5, height: 9.2, mineral: true },
      { key: "p-l3", x: -2.2, z: -13.5, height: 6.6, mineral: false },
      { key: "p-l4", x: -2.2, z: -21, height: 8.4, mineral: false },
      { key: "p-r1", x: 9.6, z: -3.5, height: 8.8, mineral: true },
      { key: "p-r2", x: 9.6, z: -9.5, height: 6.8, mineral: false },
      { key: "p-r3", x: 9.6, z: -15.5, height: 9.6, mineral: false },
      { key: "p-r4", x: 9.6, z: -22.5, height: 7.2, mineral: true },
    ],
    pierSize: { width: 1.7, depth: 1.9 },

    /** Recessed wall openings set back behind the pier line. */
    recesses: [
      { key: "r-l1", x: -3.6, z: -5.6, width: 3.4, height: 5.6 },
      { key: "r-l2", x: -3.6, z: -11, width: 2.8, height: 4.6 },
      { key: "r-r1", x: 11, z: -6.6, width: 3.2, height: 5.2 },
      { key: "r-r2", x: 11, z: -18.8, width: 3.6, height: 6 },
    ],

    /** A small number of horizontal platforms breaking up the verticals. */
    platforms: [
      { key: "pl-1", position: [3.6, 0.3, -6.5] as Vec3, size: [8.6, 0.6, 3.2] as Vec3 },
      { key: "pl-2", position: [7.4, 0.95, -19] as Vec3, size: [5.4, 0.5, 6] as Vec3 },
    ],

    /** Recessed cyan floor channels marking the route. */
    guides: [
      { key: "g-1", position: [1.05, 0.045, -9] as Vec3, size: [0.08, 0.05, 13] as Vec3 },
      { key: "g-2", position: [6.15, 0.045, -9] as Vec3, size: [0.08, 0.05, 13] as Vec3 },
      { key: "g-3", position: [3.6, 0.045, -12.6] as Vec3, size: [5.2, 0.05, 0.09] as Vec3 },
    ],

    /** Distant structural silhouettes, softened progressively by fog. */
    distant: [
      { key: "d-1", position: [-13, 9, -42] as Vec3, size: [7, 18, 7] as Vec3 },
      { key: "d-2", position: [-4, 12, -56] as Vec3, size: [6, 24, 6] as Vec3 },
      { key: "d-3", position: [7, 8, -48] as Vec3, size: [8, 16, 8] as Vec3 },
      { key: "d-4", position: [17, 11, -62] as Vec3, size: [9, 22, 9] as Vec3 },
      { key: "d-5", position: [26, 7, -44] as Vec3, size: [8, 14, 8] as Vec3 },
    ],

    /** The focal landmark: a freestanding rectangular portal on a plinth. */
    portal: {
      position: [3.6, 0, -16.5] as Vec3,
      /** Outer silhouette of the dark frame. */
      outer: { width: 5.6, height: 8 },
      /** The clear opening. */
      opening: { width: 3.2, height: 5.4 },
      /** Depth of the frame and the thickness of the illuminated inner edge. */
      frameDepth: 0.9,
      innerEdge: 0.07,
      plinth: { width: 8, depth: 4, height: 0.45 },
    },
  },
} as const;
