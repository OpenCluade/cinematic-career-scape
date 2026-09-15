import { portfolio } from "@/content/portfolio";
import { useVisualPreferences } from "@/context/VisualPreferences";

import { SectionNavigation } from "./SectionNavigation";

export function PortfolioHeader() {
  const { profile } = portfolio;
  const { reduceEffects, setReduceEffects } = useVisualPreferences();

  return (
    <header className="flex max-w-xl flex-col gap-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight md:text-3xl">
            {profile.name}
          </h1>
          <p className="truncate text-xs text-accent md:text-base">{profile.title}</p>
        </div>

        <button
          type="button"
          onClick={() => setReduceEffects(!reduceEffects)}
          aria-pressed={reduceEffects}
          className="min-h-11 shrink-0 rounded-full border border-border bg-surface/70 px-3 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:px-4"
        >
          Reduce effects: {reduceEffects ? "on" : "off"}
        </button>
      </div>

      <SectionNavigation />
    </header>
  );
}
