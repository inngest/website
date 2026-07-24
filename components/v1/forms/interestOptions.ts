// Shared "what are you looking for?" choice, used by both the Contact hub
// and the Sales inquiry form so the two stay in lockstep.

export type Interest = "sales" | "general";

export const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: "sales", label: "Sales & Product Questions" },
  { value: "general", label: "General Inquiry" },
];
