import clsx from "clsx";
export const commonClassNames = `font-semibold leading-tight sm:leading-tight`;
export const gradientClassNames = `text-stone-50`;

export function H1({
  children,
  variant = "gradient",
}: {
  children: React.ReactNode;
  variant?: "gradient" | "contrast";
}) {
  return (
    <h1
      className={clsx(
        `font-whyteInktrap text-5xl leading-tight md:text-6xl ${commonClassNames}`,
        variant === "gradient" && gradientClassNames,
        variant === "contrast" && "text-basis"
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className={`text-3xl sm:text-5xl ${commonClassNames} ${gradientClassNames}`}
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className={`text-2xl sm:text-4xl ${commonClassNames} ${gradientClassNames}`}
    >
      {children}
    </h3>
  );
}
