import type { ReactNode } from "react";
import { cn } from "@/utils/v1/cn";

/**
 * Compact status chip. `accent` is salmon, for the dark nav. `frost` is
 * white, for the coloured hero panel — salmon on that blue doesn't read.
 * `sm` fits the 24px menu title row; `md` sits beside a hero breadcrumb.
 */
export default function StatusTag({
  children,
  size = "sm",
  tone = "accent",
  className,
}: {
  children: ReactNode;
  size?: "sm" | "md";
  tone?: "accent" | "frost";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border font-v1Label uppercase leading-none tracking-[0.04em]",
        tone === "frost"
          ? "border-v1-frost text-v1-frost"
          : "border-v1-accent-salmon/80 text-v1-accent-salmon",
        size === "sm"
          ? "h-[18px] px-1.5 text-[10px]"
          : "h-6 px-2.5 text-[12px]",
        className
      )}
    >
      {children}
    </span>
  );
}
