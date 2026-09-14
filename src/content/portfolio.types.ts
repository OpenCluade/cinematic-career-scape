/**
 * Typed portfolio content contracts.
 *
 * Content is intentionally independent of the 3D scene: no coordinates,
 * camera destinations or scene identifiers live here. Layer 3 will introduce
 * a separate map from these stable IDs to camera destinations.
 */

export type SectionId = "about" | "experience" | "projects" | "contact";

export interface SectionMeta {
  id: SectionId;
  label: string;
  heading: string;
}

export interface Profile {
  /** Placeholder identity until the real CV is supplied. */
  name: string;
  title: string;
  introduction: string;
  expertise: string[];
  value: string[];
}

export interface ExperienceEntry {
  /** Stable content ID. Never derived from scene layout. */
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  summary: string;
  contributions: string[];
  technologies: string[];
  outcomes: string[];
  /** Stable IDs of related ProjectEntry records. */
  relatedProjectIds: string[];
}

export interface ProjectEntry {
  id: string;
  title: string;
  problem: string;
  contribution: string;
  architecture: string[];
  technologies: string[];
  results: string[];
}

export interface ContactDetail {
  label: string;
  value: string;
}

export interface ContactInfo {
  note: string;
  details: ContactDetail[];
}

export interface PortfolioContent {
  profile: Profile;
  sections: SectionMeta[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  contact: ContactInfo;
}
