import type { ReactNode } from "react";

// Shared dark panel chrome used across DurableExecution feature
// sections — same border + diagonal black-fade gradient as the
// event cards / about cards across the v1 redesign.
export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{
        borderColor: "rgb(var(--color-v1-carbon-300) / 0.35)",
        backgroundImage:
          "linear-gradient(295deg, rgba(2, 2, 2, 0.00) 1.46%, #0F0F0F 50.43%)",
        backgroundColor: "rgb(var(--color-v1-jetBlack))",
      }}
      className={`overflow-hidden rounded-md border ${className}`}
    >
      {children}
    </div>
  );
}
