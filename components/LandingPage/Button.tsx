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
        "inline-flex items-center gap-1 rounded-md font-medium px-6 py-2 transition-all whitespace-nowrap",
        variant === "primary" && "bg-cta hover:bg-ctaHover text-carbon-1000",
        variant === "link" &&
          "bg-transparent text-carbon-50 hover:text-carbon-200"
      )}
    >
      {children}
    </Link>
  );
}
