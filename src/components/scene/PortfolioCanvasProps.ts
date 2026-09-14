/**
 * Shared prop contract for the persistent Canvas.
 *
 * Kept in its own browser-safe module so SceneBoundary can type the lazily
 * imported component without pulling three.js into the SSR import graph.
 */
export interface PortfolioCanvasProps {
  reduceEffects: boolean;
  pageVisible: boolean;
  onReady: () => void;
  onContextLost: () => void;
  onContextRestored: () => void;
}
