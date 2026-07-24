// Carousel control — 40x40 outlined circle with a right-pointing
// chevron. The default renders the "next" side; pass `rotate-180` for
// the "prev" side.
export function CarouselArrow({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className={className}
    >
      <circle cx="20" cy="20" r="19.5" />
      <path
        d="M 16.6 14.3 L 23.6 20 L 16.6 25.7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
