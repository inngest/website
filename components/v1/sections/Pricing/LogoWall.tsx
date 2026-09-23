/**
 * Pricing hero logo banner: trust line on the left, infinite marquee of
 * customer wordmarks on the right. Unboxed — logos dissolve into the
 * copy as they approach it. No case-study links.
 */

interface CustomerLogo {
  name: string;
  src: string;
  width: number;
  height: number;
  dy?: number;
}

const LOGOS: CustomerLogo[] = [
  { name: "Replit", src: "/assets/v1/logos/replit.svg", width: 116, height: 29, dy: 2 },
  { name: "Cubic", src: "/assets/v1/logos/cubic.svg", width: 118, height: 29 },
  { name: "ElevenLabs", src: "/assets/v1/logos/elevenlabs.svg", width: 185, height: 24 },
  { name: "Cohere", src: "/assets/v1/logos/cohere.svg", width: 169, height: 26 },
  { name: "Soundcloud", src: "/assets/v1/logos/soundcloud.svg", width: 202, height: 24 },
  { name: "GitBook", src: "/assets/v1/logos/gitbook.svg", width: 127, height: 28 },
  { name: "Resend", src: "/assets/v1/logos/resend.svg", width: 118, height: 29 },
  { name: "Avoca", src: "/assets/v1/logos/avoca.svg", width: 118, height: 29 },
  {
    name: "Tripadvisor",
    src: "/assets/customers/tripadvisor.svg",
    width: 170,
    height: 26,
    dy: 2,
  },
  { name: "BAERskin", src: "/assets/v1/logos/baerskin.svg", width: 176, height: 25 },
  { name: "Artisan", src: "/assets/v1/logos/artisan.svg", width: 230, height: 22 },
  { name: "Outtake", src: "/assets/v1/logos/outtake.svg", width: 153, height: 27 },
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
  return (
    <span className="group/logo logo-item shrink-0">
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
        className="opacity-70 motion-safe:transition-opacity motion-safe:duration-300 group-hover/logo:opacity-100"
      />
    </span>
  );
}

export default function LogoWall() {
  return (
    <div
      aria-label="Trusted by 100k+ developers at logos you actually know."
      className="relative mt-4 mb-8 overflow-hidden lg:mt-8 lg:mb-14"
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
