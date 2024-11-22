import Link from "next/link";

export default function CTA({ href, text }: { href: string; text: string }) {
  return (
    <div className="flex items-center justify-center">
      <Link
        href={href}
        className="inline-flex items-center gap-1 rounded-md font-medium px-6 py-2 bg-cta hover:bg-ctaHover transition-all text-carbon-1000 whitespace-nowrap"
      >
        {text}
      </Link>
    </div>
  );
}
