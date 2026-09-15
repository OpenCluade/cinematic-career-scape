import { PortfolioNavigationProvider } from "@/context/PortfolioNavigation";
import { VisualPreferencesProvider } from "@/context/VisualPreferences";
import { SceneBoundary } from "@/components/scene/SceneBoundary";

import { ContentPanel } from "./ContentPanel";
import { PortfolioHeader } from "./PortfolioHeader";

/**
 * Single persistent page composition.
 *
 * There is exactly one SceneBoundary, at a stable position in the React tree.
 * Only CSS changes between layouts:
 * - narrow: a fixed-height scene band sits between navigation and content,
 *   and its height never depends on how long the content is,
 * - wide: the same element is stretched behind the whole viewport with the
 *   content column overlaid on the left.
 *
 * Changing section re-renders only the panel, never the Canvas.
 */
export function PortfolioPage() {
  return (
    <VisualPreferencesProvider>
      <PortfolioNavigationProvider>
        <main className="relative grid min-h-screen w-full grid-cols-1 grid-rows-[auto_15rem_1fr] overflow-x-hidden bg-background text-foreground md:flex md:flex-col">
          <div className="relative row-start-2 border-y border-border/60 md:absolute md:inset-0 md:row-auto md:border-0">
            <SceneBoundary />
          </div>

          <div className="relative z-10 row-start-1 px-4 pb-4 pt-6 md:px-10 md:pb-0 md:pt-10">
            <PortfolioHeader />
          </div>

          <div className="relative z-10 row-start-3 px-4 pb-10 pt-4 md:flex-1 md:px-10 md:pb-12 md:pt-6">
            <ContentPanel />
          </div>
        </main>
      </PortfolioNavigationProvider>
    </VisualPreferencesProvider>
  );
}
