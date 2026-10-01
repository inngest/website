import Link from "next/link";
export default function HiringCallout() {
  return (
    <Link
      href="/careers"
      className="inline-flex py-1 px-4 font-semibold text-basis text-xs border border-subtle rounded-full hover:border-primary-intense transition-all duration-150"
    >
      We're hiring!
    </Link>
  );
}
