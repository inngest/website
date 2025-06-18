import Link from "next/link";
import clsx from "clsx";

export default function Button({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "link";
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-1 whitespace-nowrap px-6 py-2 font-medium transition-all",
        variant === "primary" && "bg-cta text-carbon-1000 hover:bg-ctaHover",
        variant === "link" &&
          "bg-transparent text-carbon-50 hover:text-carbon-200"
      )}
    >
      {children}
    </Link>
  );
}
