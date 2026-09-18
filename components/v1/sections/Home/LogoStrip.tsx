/**
 * Customer logo strip — sits directly below the Hero.
 *
 * Auto-scrolling horizontal marquee. The logo list is duplicated so the
 * `translateX(-50%)` keyframe loops seamlessly without a visible jump.
 * Animation is gated by `motion-safe:` so it pauses for users with
 * `prefers-reduced-motion: reduce`.
 *
 * Logos with a `caseStudyHref` show a small Inngest-orange indicator
 * dot and link through to that customer story on hover/click.
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

import Link from "next/link";

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
  /** When set, the logo shows an orange case-study indicator and links
   *  to that customer story. */
  caseStudyHref?: string;
  /** Extra horizontal nudge (px) for the case-study dot — positive
   *  pushes it further past the right edge of the wordmark. */
  dotDx?: number;
}

// Heights are optically cheated per logo: very wide wordmarks
// (Soundcloud 8.4:1, ElevenLabs 7.7:1, BAERskin 7:1) render shorter,
// compact marks (Cubic, Resend, Avoca ~4:1) render taller, so every
// logo reads at roughly the same visual mass in the strip.
const LOGOS: CustomerLogo[] = [
  { name: "Replit", src: "/assets/v1/logos/replit.svg", width: 116, height: 29, dy: 2 },
  {
    name: "Cubic",
    src: "/assets/v1/logos/cubic.svg",
    width: 118,
    height: 29,
    caseStudyHref: "/customers/cubic",
  },
  {
    name: "ElevenLabs",
    src: "/assets/v1/logos/elevenlabs.svg",
    width: 185,
    height: 24,
  },
  {
    name: "Cohere",
    src: "/assets/v1/logos/cohere.svg",
    width: 169,
    height: 26,
    caseStudyHref: "/customers/otto",
  },
  {
    name: "Soundcloud",
    src: "/assets/v1/logos/soundcloud.svg",
    width: 202,
    height: 24,
    caseStudyHref: "/customers/soundcloud",
  },
  {
    name: "GitBook",
    src: "/assets/v1/logos/gitbook.svg",
    width: 127,
    height: 28,
    caseStudyHref: "/customers/gitbook",
  },
  {
    name: "Resend",
    src: "/assets/v1/logos/resend.svg",
    width: 118,
    height: 29,
    caseStudyHref: "/customers/resend",
    // Wordmark sits flush to the SVG right edge, so the default
    // -right-1.5 lands on the "d" — nudge the dot clear of the letter.
    dotDx: 8,
  },
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
    caseStudyHref: "/customers/baerskin-tactical",
  },
  {
    name: "Outtake",
    src: "/assets/v1/logos/outtake.svg",
    width: 153,
    height: 27,
    caseStudyHref: "/customers/outtake",
  },
];

const REF = "logo-strip";

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

function LogoMark({
  logo,
  decorative,
}: {
  logo: CustomerLogo;
  /** Second marquee copy — keep out of tab order / a11y tree. */
  decorative: boolean;
}) {
  const img = (
    <img
      src={logo.src}
      alt={decorative ? "" : logo.name}
      width={logo.width}
      height={logo.height}
      style={{
        height: `clamp(${Math.round(logo.height * 0.6)}px, 4vw, ${logo.height}px)`,
        width: "auto",
        transform: logo.dy ? `translateY(${logo.dy}px)` : undefined,
      }}
      className="shrink-0 opacity-70 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-v1-out group-hover/logo:opacity-100"
    />
  );

  if (!logo.caseStudyHref) {
    return (
      <span className="group/logo logo-item relative shrink-0">{img}</span>
    );
  }

  const href = `${logo.caseStudyHref}?ref=${REF}`;
  const className =
    "group/logo logo-item relative shrink-0 outline-none focus-visible:opacity-100";

  // Both marquee copies must be real links — after the track translates
  // past -50%, the duplicate set is what's under the cursor. The second
  // copy stays out of the tab order / a11y tree via tabIndex + the
  // parent `aria-hidden`.
  return (
    <Link
      href={href}
      className={className}
      aria-label={
        decorative ? undefined : `${logo.name} — Read the case study`
      }
      tabIndex={decorative ? -1 : undefined}
    >
      {img}
      <span
        aria-hidden="true"
        className="absolute -right-1.5 -top-1 size-1.5 rounded-full bg-v1-accent-salmon shadow-[0_0_0_2px_rgb(var(--color-v1-bg-canvas-base))] sm:size-[7px]"
        style={
          logo.dotDx
            ? { right: `-${6 + logo.dotDx}px` } // base -right-1.5 = 6px
            : undefined
        }
      />
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-v1-surfaceElevated px-2.5 py-1 font-v1Label text-[10px] uppercase leading-none tracking-wide text-v1-frost opacity-0 shadow-[0_0_0_1px_rgb(var(--color-v1-border-subtle))] motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-v1-out group-hover/logo:opacity-100 group-focus-visible/logo:opacity-100 sm:text-[11px]"
      >
        Read the case study
      </span>
    </Link>
  );
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
      className="group/strip relative mt-2.5 overflow-hidden py-10 lg:mt-0 lg:py-14"
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
      {/* Pause is gated to hovering an actual logo (`group/strip:has(.logo-item:hover)`)
          rather than anywhere in the section, so passive cursor
          travel across the strip doesn't freeze the marquee.

          The track is two self-contained copies, each carrying its own
          trailing gap (`pr-*` matching the inter-logo `gap-x-*`). This makes
          one copy's width exactly equal to the `-50%` translate, so the
          second copy butts seamlessly against the first at every loop reset
          — a single flex-gap row would leave a half-gap of empty space at
          the seam since the duplicated track has one fewer gap than logos. */}
      <div
        className="relative flex w-max items-center motion-safe:animate-[v1-logo-marquee_40s_linear_infinite] motion-safe:group-[:has(.logo-item:hover)]/strip:[animation-play-state:paused]"
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="flex shrink-0 items-center gap-x-[21px] pr-[21px] lg:gap-x-20 lg:pr-20"
          >
            {LOGOS.map((logo) => (
              <LogoMark
                key={`${logo.name}-${copy}`}
                logo={logo}
                decorative={copy === 1}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );

  if (!contained) return strip;

  // Centered to the shared page container so the row aligns with sibling
  // sections; the section's own overflow clips the marquee to this
  // width and the edge gradient fades at the container boundary.
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-8">
      {strip}
    </div>
  );
}
