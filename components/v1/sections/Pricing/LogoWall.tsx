/**
 * Pricing hero logo banner: trust line on the left, infinite marquee of
 * customer wordmarks on the right. Unboxed — logos dissolve into the
 * copy as they approach it. Logos with a case study show the same orange
 * indicator as the homepage strip and link through to the story.
 */

import Link from "next/link";

interface CustomerLogo {
  name: string;
  src: string;
  width: number;
  height: number;
  dy?: number;
  caseStudyHref?: string;
  /** Extra horizontal nudge (px) for the case-study dot. */
  dotDx?: number;
}

const REF = "pricing-logo-wall";

const LOGOS: CustomerLogo[] = [
  {
    name: "Ordinal",
    src: "/assets/customers/ordinal-logo-white.svg",
    width: 131,
    height: 36,
    caseStudyHref: "/customers/ordinal",
  },
  {
    name: "Replit",
    src: "/assets/v1/logos/replit.svg",
    width: 116,
    height: 29,
    dy: 2,
  },
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
    name: "Artisan",
    src: "/assets/v1/logos/artisan.svg",
    width: 230,
    height: 22,
  },
  {
    name: "Outtake",
    src: "/assets/v1/logos/outtake.svg",
    width: 153,
    height: 27,
    caseStudyHref: "/customers/outtake",
  },
];

// Mask lives on the clip window (not the moving track) so the fade
// stays pinned to the copy. Transparent under the text, then a long
// dissolve so wordmarks melt into it as they scroll left. Soft fade
// on the far right so they don't hard-cut at the page edge.
const intoCopyMask =
  "linear-gradient(to right, transparent 0, transparent 13.5rem, black 22.5rem, black calc(100% - 72px), transparent 100%)";

function LogoMark({
  logo,
  decorative,
}: {
  logo: CustomerLogo;
  decorative: boolean;
}) {
  const img = (
    <img
      src={logo.src}
      alt={decorative ? "" : logo.name}
      width={logo.width}
      height={logo.height}
      style={{
        height: `clamp(${Math.round(logo.height * 0.6)}px, 4vw, ${
          logo.height
        }px)`,
        width: "auto",
        transform: logo.dy ? `translateY(${logo.dy}px)` : undefined,
      }}
      className="opacity-70 group-hover/logo:opacity-100 motion-safe:transition-opacity motion-safe:duration-300"
    />
  );

  if (!logo.caseStudyHref) {
    return (
      <span className="group/logo logo-item relative shrink-0">{img}</span>
    );
  }

  return (
    <Link
      href={`${logo.caseStudyHref}?ref=${REF}`}
      className="group/logo logo-item relative shrink-0 outline-none focus-visible:opacity-100"
      aria-label={decorative ? undefined : `${logo.name} — Read the case study`}
      tabIndex={decorative ? -1 : undefined}
    >
      {img}
      <span
        aria-hidden="true"
        className="absolute -right-1.5 -top-1 size-1.5 rounded-full bg-v1-accent-salmon shadow-[0_0_0_2px_rgb(var(--color-v1-bg-canvas-base))] sm:size-[7px]"
        style={logo.dotDx ? { right: `-${6 + logo.dotDx}px` } : undefined}
      />
    </Link>
  );
}

export default function LogoWall() {
  return (
    <div
      aria-label="Trusted by 100k+ developers at logos you actually know."
      className="relative mb-8 mt-4 overflow-hidden lg:mb-14 lg:mt-8"
      role="region"
    >
      <p className="relative z-10 ml-8 w-[11.5rem] py-0.5 text-[12px] leading-[17px] text-v1-frost/80">
        Trusted by 100k+
        <br />
        developers at logos
        <br />
        you actually know.
      </p>

      <div
        className="group/strip absolute inset-0 overflow-hidden"
        style={{ maskImage: intoCopyMask, WebkitMaskImage: intoCopyMask }}
      >
        <div className="flex h-full w-max items-center motion-safe:animate-[v1-logo-marquee_40s_linear_infinite] motion-safe:group-[:has(.logo-item:hover)]/strip:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 items-center gap-x-10 pr-10 lg:gap-x-14 lg:pr-14"
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
      </div>
    </div>
  );
}
