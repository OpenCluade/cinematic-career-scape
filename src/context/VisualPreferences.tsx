import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

interface VisualPreferencesValue {
  /** User-chosen "Reduce effects" quality switch. Independent of motion. */
  reduceEffects: boolean;
  setReduceEffects: (value: boolean) => void;
  /** System reduced-motion preference, tracked live. */
  reducedMotion: boolean;
}

const VisualPreferencesContext = createContext<VisualPreferencesValue | null>(null);

export function VisualPreferencesProvider({ children }: { children: ReactNode }) {
  const [reduceEffects, setReduceEffects] = useState(false);
  const reducedMotion = useReducedMotion();

  const value = useMemo(
    () => ({ reduceEffects, setReduceEffects, reducedMotion }),
    [reduceEffects, reducedMotion],
  );

  return (
    <VisualPreferencesContext.Provider value={value}>{children}</VisualPreferencesContext.Provider>
  );
}

export function useVisualPreferences(): VisualPreferencesValue {
  const value = useContext(VisualPreferencesContext);
  if (!value) {
    throw new Error("useVisualPreferences must be used inside VisualPreferencesProvider");
  }
  return value;
}
