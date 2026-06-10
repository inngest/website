/**
 * Customer logo strip — sits directly below the Hero.
 *
 * Auto-scrolling horizontal marquee. The logo list is duplicated so the
 * `translateX(-50%)` keyframe loops seamlessly without a visible jump.
 * Animation is gated by `motion-safe:` so it pauses for users with
 * `prefers-reduced-motion: reduce`.
 *
 * Each logo is a flattened SVG saved at /public/assets/v1/logos/. Heights
 * vary per logo; SVGs ship with `fill="white"` since
 * `<img src>` does not inherit `currentColor`.
 *
 * Responsive sizing: each logo's height fluid-clamps between 60 % of its
 * design size (mobile floor) and its full design size (lg+ cap) on a 4vw
 * curve, so the row reads compactly on phones (~17.5 px mobile lockup)
 * without distorting per-logo proportions. Section padding
 * and inter-logo gap follow the same shrink-on-mobile pattern.
 */

interface CustomerLogo {
  name: string;
  src: string;
  width: number;
  height: number;
  /** Optical vertical nudge (px). Wordmarks with descenders ("p" in
   *  Replit/Tripadvisor) have bounding-box below the baseline, so
   *  flex centering leaves their visual mass high — a small positive
   *  nudge re-centers the cap-height mass on the strip's midline. */
  dy?: number;
}

// Heights are optically cheated per logo: very wide wordmarks
// (Soundcloud 8.4:1, ElevenLabs 7.7:1, BAERskin 7:1) render shorter,
// compact marks (Cubic, Resend, Avoca ~4:1) render taller, so every
// logo reads at roughly the same visual mass in the strip.
const LOGOS: CustomerLogo[] = [
  { name: "Replit", src: "/assets/v1/logos/replit.svg", width: 116, height: 29, dy: 2 },
  { name: "Cubic", src: "/assets/v1/logos/cubic.svg", width: 118, height: 29 },
  {
    name: "ElevenLabs",
    src: "/assets/v1/logos/elevenlabs.svg",
    width: 185,
    height: 24,
  },
  { name: "Cohere", src: "/assets/v1/logos/cohere.svg", width: 169, height: 26 },
  {
    name: "Soundcloud",
    src: "/assets/v1/logos/soundcloud.svg",
    width: 202,
    height: 24,
  },
  {
    name: "GitBook",
    src: "/assets/v1/logos/gitbook.svg",
    width: 127,
    height: 28,
  },
  { name: "Resend", src: "/assets/v1/logos/resend.svg", width: 118, height: 29 },
  { name: "Avoca", src: "/assets/v1/logos/avoca.svg", width: 118, height: 29 },
  {
    name: "Tripadvisor",
    src: "/assets/customers/tripadvisor.svg",
    width: 170,
    height: 26,
    dy: 2,
  },
  {
    name: "BAERskin",
    src: "/assets/v1/logos/baerskin.svg",
    width: 176,
    height: 25,
  },
  {
    name: "Outtake",
    src: "/assets/v1/logos/outtake.svg",
    width: 153,
    height: 27,
  },
];

interface LogoStripProps {
  /**
   * Constrain the marquee to the shared 1440px page container (with the
   * standard horizontal padding) instead of bleeding full-width. The edge
   * gradient then fades at the container boundary, and — because the visible
   * window (~1376px) is narrower than one logo copy (~1736px) — the two-copy
   * track never out-runs the viewport, so it reads as a true infinite loop.
   * Default (false) keeps the full-bleed behavior used on the home page.
   */
  contained?: boolean;
}

export default function LogoStrip({ contained = false }: LogoStripProps) {
  // Soft 120px fade at both horizontal edges so logos drift in/out of view
  // instead of hard-cutting. `[--mask]` keeps both the standard and the
  // legacy WebKit variant in one place.
  const edgeMask =
    "linear-gradient(to right, transparent 0, black 120px, black calc(100% - 120px), transparent 100%)";

  const strip = (
    <section
      aria-label="Trusted by"
      className="group/strip relative mt-2.5 overflow-hidden py-[26.5px] lg:mt-0 lg:py-12"
      // The horizontal edge gradient lives on this fixed-width clip window —
      // NOT on the moving track — so the 120px fade maps to the visible left/
      // right edges. On the track the mask would scroll with it and the fade
      // would sit at the off-screen track edges, hard-cutting the logos.
      style={{ maskImage: edgeMask, WebkitMaskImage: edgeMask }}
    >
      {/* Top-edge fade so the hero's grain bleeds into this strip
          instead of a hard horizontal cut. Vertical mask only on the
          top 96px; horizontal edge mask is applied on the section. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 bg-gradient-to-b from-v1-canvasBase/40 to-transparent"
      />
      {/* Pause is gated to hovering an actual logo (`group/strip:has(img:hover)`)
          rather than anywhere in the section, so passive cursor
          travel across the strip doesn't freeze the marquee.

          The track is two self-contained copies, each carrying its own
          trailing gap (`pr-*` matching the inter-logo `gap-x-*`). This makes
          one copy's width exactly equal to the `-50%` translate, so the
          second copy butts seamlessly against the first at every loop reset
          — a single flex-gap row would leave a half-gap of empty space at
          the seam since the duplicated track has one fewer gap than logos. */}
      <div
        className="relative flex w-max items-center motion-safe:animate-[v1-logo-marquee_40s_linear_infinite] motion-safe:group-[:has(img:hover)]/strip:[animation-play-state:paused]"
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center gap-x-[21px] pr-[21px] lg:gap-x-20 lg:pr-20"
          >
            {LOGOS.map((logo) => (
              <img
                key={`${logo.name}-${copy}`}
                src={logo.src}
                alt={copy === 0 ? logo.name : ""}
                width={logo.width}
                height={logo.height}
                style={{
                  height: `clamp(${Math.round(logo.height * 0.6)}px, 4vw, ${logo.height}px)`,
                  width: "auto",
                  transform: logo.dy ? `translateY(${logo.dy}px)` : undefined,
                }}
                className="shrink-0 opacity-70 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-v1-out hover:opacity-100"
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );

  if (!contained) return strip;

  // Centered to the shared page container so the row aligns with sibling
  // sections; the section's own `overflow-hidden` clips the marquee to this
  // width and the edge gradient fades at the container boundary.
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-8">
      {strip}
    </div>
  );
}
