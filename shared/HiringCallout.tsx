import Link from "next/link";
export default function HiringCallout() {
  return (
    <Link
      href="/careers"
      className="inline-flex rounded-full border border-subtle px-4 py-1 text-xs font-semibold text-basis transition-all duration-150 hover:border-primary-intense"
    >
      We're hiring!
    </Link>
  );
}
