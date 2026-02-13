import clsx from "clsx";
import { StarIcon } from "@heroicons/react/24/outline";

const variantStyle = (variant: string): string => {
  switch (variant) {
    case "medium":
      return "px-1.5 py-0.5 ring-1 ring-inset";

    default:
      return null;
  }
};

const colorStyle = (
  color: string,
  variant: string,
  background: "default" | "page"
): string => {
  switch (variant) {
    case "small":
      return `text-${color}-${
        background === "default" ? "400" : "600"
      } dark:text-${color}-${background === "default" ? "300" : "400"}`;

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
  variant = "medium",
  color = valueColorMap[children.toLowerCase()] ?? "indigo",
  background = "default",
  className,
}: {
  children: string;
  variant?: "small" | "medium";
  color?: string;
  className?: string;
  background?: "default" | "page";
}) {
  const isNewTag = children.toLowerCase() === "new";

  return (
    <span
      className={clsx(
        "text-xs leading-2",
        isNewTag && "inline-flex items-center gap-0.5",
        variantStyle(variant),
        colorStyle(color, variant, background),
        className
      )}
    >
      {isNewTag && <StarIcon className="h-3 w-3 shrink-0" aria-hidden />}
      {children}
    </span>
  );
}
