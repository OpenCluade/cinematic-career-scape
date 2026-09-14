import { PortfolioNavigationProvider } from "@/context/PortfolioNavigation";
import { VisualPreferencesProvider } from "@/context/VisualPreferences";
import { SceneBoundary } from "@/components/scene/SceneBoundary";

import { ContentPanel } from "./ContentPanel";
import { PortfolioHeader } from "./PortfolioHeader";

/**
 * Single persistent page composition.
 *
 * The scene layer and the HTML layer are siblings: changing section re-renders
 * only the panel, never the Canvas.
 */
export function PortfolioPage() {
  return (
    <VisualPreferencesProvider>
      <PortfolioNavigationProvider>
        <main className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground">
          <SceneBoundary />

          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:min-h-screen md:px-8 md:py-12">
            <PortfolioHeader />
            <ContentPanel />
          </div>
        </main>
      </PortfolioNavigationProvider>
    </VisualPreferencesProvider>
  );
}
