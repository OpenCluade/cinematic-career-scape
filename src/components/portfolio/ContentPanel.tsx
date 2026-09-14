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

  return (
    <section
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
