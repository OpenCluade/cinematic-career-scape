import { portfolio } from "@/content/portfolio";
import { useVisualPreferences } from "@/context/VisualPreferences";

import { SectionNavigation } from "./SectionNavigation";

export function PortfolioHeader() {
  const { profile } = portfolio;
  const { reduceEffects, setReduceEffects } = useVisualPreferences();

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{profile.name}</h1>
          <p className="mt-1 text-sm text-accent md:text-base">{profile.title}</p>
        </div>

        <button
          type="button"
          onClick={() => setReduceEffects(!reduceEffects)}
          aria-pressed={reduceEffects}
          className="min-h-11 rounded-full border border-border bg-surface/60 px-4 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Reduce effects: {reduceEffects ? "on" : "off"}
        </button>
      </div>

      <SectionNavigation />
    </header>
  );
}
