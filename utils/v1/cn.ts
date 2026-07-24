import clsx, { type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import typeTokens from "@/utils/v1/typography.tokens.json";

// Register `text-v1-{name}` utilities as font-sizes so tailwind-merge
// doesn't misgroup them with `text-v1-frost`/etc. text-color classes.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ "text-v1": Object.keys(typeTokens) }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
