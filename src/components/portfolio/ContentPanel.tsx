import { useEffect, useRef } from "react";

import { portfolio } from "@/content/portfolio";
import { usePortfolioNavigation } from "@/context/PortfolioNavigation";

import { AboutSection } from "./sections/AboutSection";
import { ContactSection } from "./sections/ContactSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { ProjectsSection } from "./sections/ProjectsSection";

/**
 * Non-modal, naturally scrollable content panel. Focus is never trapped and
 * the panel is always present in the document.
 */
export function ContentPanel() {
  const { activeSection } = usePortfolioNavigation();
  const meta = portfolio.sections.find((section) => section.id === activeSection);
  const panelRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // A new section starts at its beginning. On wide screens the panel scrolls
  // internally; on narrow screens the page scrolls, so the panel top is
  // brought back into view. Focus is deliberately left where the visitor put
  // it, so keyboard navigation stays on the section buttons.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const panel = panelRef.current;
    if (!panel) return;

    if (panel.scrollTop > 0) panel.scrollTop = 0;

    const top = panel.getBoundingClientRect().top;
    if (top < 0) {
      window.scrollTo({ top: window.scrollY + top, behavior: "auto" });
    }
  }, [activeSection]);

  return (
    <section
      ref={panelRef}
      id="portfolio-panel"
      aria-labelledby="portfolio-panel-heading"
      className="w-full max-w-xl rounded-xl border border-border bg-surface/75 p-5 shadow-lg backdrop-blur-md md:max-h-[calc(100vh-13rem)] md:overflow-y-auto"
    >
      <h2 id="portfolio-panel-heading" className="text-xl font-semibold tracking-tight">
        {meta?.heading ?? "About"}
      </h2>

      <div className="mt-4">
        {activeSection === "about" && <AboutSection />}
        {activeSection === "experience" && <ExperienceSection />}
        {activeSection === "projects" && <ProjectsSection />}
        {activeSection === "contact" && <ContactSection />}
      </div>
    </section>
  );
}
