import type { PortfolioContent } from "./portfolio.types";

/**
 * Layer 1 placeholder content.
 *
 * Only the name placeholder and the professional title are fixed by the
 * specification. Everything else is an explicitly labelled placeholder:
 * no invented employers, dates, achievements, metrics, testimonials,
 * links or contact details.
 */

export const PLACEHOLDER = "[placeholder]";

export const portfolio: PortfolioContent = {
  profile: {
    name: "[Your Name]",
    title: "Solution Architect · Cloud · DevOps",
    introduction:
      "[placeholder — short personal introduction to be supplied with the CV in Layer 4]",
    expertise: [
      "Solution architecture",
      "Cloud infrastructure",
      "DevOps and automation",
      "Backend development",
    ],
    value: [
      "[placeholder — the value you bring to organisations, in your own words]",
      "[placeholder — second value statement]",
    ],
  },

  sections: [
    { id: "about", label: "About", heading: "About" },
    { id: "experience", label: "Experience", heading: "Experience" },
    { id: "projects", label: "Projects", heading: "Projects" },
    { id: "contact", label: "Contact", heading: "Contact" },
  ],

  experience: [
    {
      id: "experience-placeholder-1",
      company: "[Company placeholder 1]",
      role: "[Role placeholder]",
      startDate: "[start date]",
      endDate: "[end date]",
      summary: "[placeholder — summary of the engagement]",
      contributions: ["[placeholder — responsibility or contribution]"],
      technologies: ["[placeholder — technology]"],
      outcomes: ["[placeholder — outcome, no invented metrics]"],
      relatedProjectIds: ["project-placeholder-1"],
    },
    {
      id: "experience-placeholder-2",
      company: "[Company placeholder 2]",
      role: "[Role placeholder]",
      startDate: "[start date]",
      endDate: "[end date]",
      summary: "[placeholder — summary of the engagement]",
      contributions: ["[placeholder — responsibility or contribution]"],
      technologies: ["[placeholder — technology]"],
      outcomes: ["[placeholder — outcome, no invented metrics]"],
      relatedProjectIds: [],
    },
  ],

  projects: [
    {
      id: "project-placeholder-1",
      title: "[Project placeholder 1]",
      problem: "[placeholder — problem or business need]",
      contribution: "[placeholder — your role and contribution]",
      architecture: ["[placeholder — architecture or technical decision]"],
      technologies: ["[placeholder — technology]"],
      results: ["[placeholder — result, metrics only when supplied]"],
    },
    {
      id: "project-placeholder-2",
      title: "[Project placeholder 2]",
      problem: "[placeholder — problem or business need]",
      contribution: "[placeholder — your role and contribution]",
      architecture: ["[placeholder — architecture or technical decision]"],
      technologies: ["[placeholder — technology]"],
      results: ["[placeholder — result, metrics only when supplied]"],
    },
  ],

  contact: {
    note: "Contact details and professional links will be added once you supply them. Nothing here is invented, and there is no CV download yet.",
    details: [
      { label: "Email", value: "[placeholder — email address]" },
      { label: "LinkedIn", value: "[placeholder — profile URL]" },
      { label: "Location", value: "[placeholder — location]" },
    ],
  },
};

export function findProjectById(id: string) {
  return portfolio.projects.find((project) => project.id === id);
}
