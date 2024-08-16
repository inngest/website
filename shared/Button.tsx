import { AnchorHTMLAttributes } from "react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "@remixicon/react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  arrow?: "left" | "right";
  full?: boolean;
  children?: React.ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button({
  children,
  variant = "primary",
  size = "md",
  arrow,
  full = false,
  target = "",
  ...props
}: ButtonProps) {
  const sizes = {
    sm: "text-sm px-4 py-1.5",
    md: "text-base px-6 py-2.5",
    lg: "text-lg px-8 py-4",
  };

  const variants = {
    // primary: "text-white bg-indigo-500 hover:bg-indigo-400 hover:text-white",
    primary: `bg-cta hover:bg-ctaHover text-carbon-1000 font-medium`,
    secondary: `
      bg-slate-300/80 hover:bg-slate-300/100 text-slate-900 hover:text-slate-900,
      dark:bg-slate-600/80 dark:hover:bg-slate-500/100 dark:text-white dark:hover:text-white
    `,
    tertiary:
      "bg-slate-100 hover:bg-slate-300 text-slate-800 dark:bg-slate-800  dark:hover:bg-slate-700 dark:text-slate-100",
    outline: `text-carbon-50 border border-carbon-50 text-carbon-1000 hover:bg-carbon-50/10`,
    dark: `bg-carbon-1000 hover:bg-carbon-900 text-white`,
  };

  const width = full ? "w-full" : "";

  return (
    <a
      target={target}
      href={props.href}
      className={`whitespace-nowrap button group inline-flex items-center justify-center gap-0.5 rounded-lg font-medium tracking-tight transition-all ${variants[variant]} ${sizes[size]} ${props.className} ${width}`}
    >
      {arrow && arrow === "left" ? (
        <RiArrowLeftSLine className="group-hover:-translate-x-1 transition-transform duration-150 -ml-1.5" />
      ) : null}
      {children}
      {arrow && arrow === "right" ? (
        <RiArrowRightSLine className="group-hover:translate-x-1 transition-transform duration-150 -mr-1.5" />
      ) : null}
    </a>
  );
}
