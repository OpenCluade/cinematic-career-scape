import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { SectionId } from "@/content/portfolio.types";

interface NavigationValue {
  activeSection: SectionId;
  /** Optional stable content ID of a selected company or project entry. */
  selectedEntryId: string | null;
  selectSection: (section: SectionId) => void;
  selectEntry: (entryId: string | null) => void;
}

const NavigationContext = createContext<NavigationValue | null>(null);

export function PortfolioNavigationProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>("about");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const selectSection = useCallback((section: SectionId) => {
    setActiveSection(section);
    setSelectedEntryId(null);
  }, []);

  const selectEntry = useCallback((entryId: string | null) => {
    setSelectedEntryId(entryId);
  }, []);

  const value = useMemo(
    () => ({ activeSection, selectedEntryId, selectSection, selectEntry }),
    [activeSection, selectedEntryId, selectSection, selectEntry],
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function usePortfolioNavigation(): NavigationValue {
  const value = useContext(NavigationContext);
  if (!value) {
    throw new Error("usePortfolioNavigation must be used inside PortfolioNavigationProvider");
  }
  return value;
}
