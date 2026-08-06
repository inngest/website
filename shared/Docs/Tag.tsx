import clsx from "clsx";
import { StarIcon } from "@heroicons/react/24/outline";

const sizeClasses = (variant: string): string => {
  switch (variant) {
    case "medium":
      return "px-2 py-0.5 ring-1 ring-inset";

    default:
      return null;
  }
};

// Tailwind scans source files as text, so these class names must be written
// out statically — interpolated names like `ring-${color}-300` are never
// generated into the stylesheet.
const variantClasses: Record<string, { default: string; outline: string }> = {
  matcha: {
    default: "bg-matcha-500 dark:bg-matcha-600 text-white ring-0",
    outline:
      "bg-transparent text-matcha-600 dark:text-matcha-300 ring-matcha-300 ring-1",
  },
  breeze: {
    default: "bg-breeze-500 dark:bg-breeze-600 text-white ring-0",
    outline:
      "bg-transparent text-breeze-600 dark:text-breeze-300 ring-breeze-300 ring-1",
  },
  honey: {
    default: "bg-honey-500 dark:bg-honey-600 text-white ring-0",
    outline:
      "bg-transparent text-honey-600 dark:text-honey-300 ring-honey-300 ring-1",
  },
  ruby: {
    default: "bg-ruby-500 dark:bg-ruby-600 text-white ring-0",
    outline:
      "bg-transparent text-ruby-600 dark:text-ruby-300 ring-ruby-300 ring-1",
  },
  indigo: {
    default: "bg-indigo-500 dark:bg-indigo-600 text-white ring-0",
    outline:
      "bg-transparent text-indigo-600 dark:text-indigo-300 ring-indigo-300 ring-1",
  },
};

const colorClasses = (
  color: string,
  size: "small" | "medium" = "medium",
  variant: "default" | "outline" = "default"
): string => {
  const boxClasses = "rounded-full";
  const classes = variantClasses[color] ?? variantClasses.indigo;
  return [boxClasses, classes[variant]].join(" ");
  switch (size) {
    case "small":
      return `text-${color}-${
        variant === "default" ? "400" : "600"
      } dark:text-${color}-${variant === "default" ? "300" : "400"}`;

    case "medium":
      if (color === "matcha") {
        return "rounded-full bg-matcha-500 dark:bg-matcha-600 text-white ring-0";
      }
      return `rounded-lg ring-${color}-300 dark:ring-${color}-400/30 bg-${color}-400/10 text-${color}-500 dark:text-${color}-400`;

    default:
      return null;
  }
};

const valueColorMap = {
  get: "matcha",
  post: "breeze",
  put: "honey",
  delete: "ruby",
};

export function Tag({
  children,
  size = "medium",
  color = valueColorMap[children.toLowerCase()] ?? "indigo",
  variant = "default",
  className,
}: {
  children: string;
  size?: "small" | "medium";
  color?: string;
  className?: string;
  variant?: "default" | "outline";
}) {
  const isNewTag = children.toLowerCase() === "new";

  return (
    <span
      className={clsx(
        "leading-2 text-xs",
        isNewTag && "inline-flex items-center gap-0.5",
        sizeClasses(size),
        colorClasses(color, size, variant),
        className
      )}
    >
      {isNewTag && <StarIcon className="h-3 w-3 shrink-0" aria-hidden />}
      {children}
    </span>
  );
}
