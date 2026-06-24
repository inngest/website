import create from "zustand";

// Client-side selection for the patterns hub's category filter. Browsing by
// primitive is in-page state (not a route), so this store keeps the active
// filter across navigation (hub → pattern → back) without persisting it to
// localStorage — keeping it consistent with the statically-rendered default.
interface PatternFilterState {
  // The selected category id, or null for "All".
  category: string | null;
  setCategory: (category: string | null) => void;
}

export const usePatternFilterStore = create<PatternFilterState>((set) => ({
  category: null,
  setCategory: (category) => set({ category }),
}));
