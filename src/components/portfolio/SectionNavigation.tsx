import { portfolio } from "@/content/portfolio";
import { usePortfolioNavigation } from "@/context/PortfolioNavigation";
import { cn } from "@/lib/utils";

export function SectionNavigation() {
  const { activeSection, selectSection } = usePortfolioNavigation();

  return (
    <nav aria-label="Portfolio sections">
      <ul className="flex flex-wrap gap-2">
        {portfolio.sections.map((section) => {
          const isActive = section.id === activeSection;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => selectSection(section.id)}
                aria-current={isActive ? "true" : undefined}
                aria-controls="portfolio-panel"
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  isActive
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border bg-surface/60 text-foreground/80 hover:border-accent/60 hover:text-foreground",
                )}
              >
                {section.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
