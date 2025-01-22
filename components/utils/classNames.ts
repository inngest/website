import { twMerge } from "tailwind-merge";

export function cn(...inputs: Parameters<typeof twMerge>): string {
  return twMerge(...inputs);
}
