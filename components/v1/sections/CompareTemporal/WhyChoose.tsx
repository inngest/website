import {
  FeatureCardsGrid,
  type FeatureCard,
} from "@/components/v1/sections/Home/FeatureCardsGrid";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";

/**
 * "Why devs choose Inngest over Temporal" — uses the shared 3-column
 * feature cards (FeatureCardsGrid: elevated surfaces, salmon-flood
 * hover, serialised hand-off) under this section's heading. The lead
 * "No workers" card is the idle-active highlight; each card carries a
 * line-art icon + title + subtitle tagline + body. Copy is verbatim
 * from the design (incl. "confir" / "memorization").
 *
 * The card chrome + hover effects come from the shared component; the
 * geometry/type are matched to the design via the per-card overrides
 * in CARD_STYLE below.
 */
// Per-card style overrides shared by all three cards (the shared grid is
// tuned for the homepage; these match it to the Temporal spec).
const CARD_STYLE = {
  // Card padding 32 top / 64 bottom / 20 sides. The
  // icon group adds its own 8px top slack, so pt-6 (24) + 8 = 32.
  cardClassName: "justify-start gap-10 sm:gap-10 px-5 pt-6 pb-16 sm:px-5 sm:pt-6 sm:pb-16",
  titleBlockClassName: "gap-[20px]",
  titleClassName: "text-v1-heading-md-cap lg:text-v1-heading-md-cap",
  subtitleClassName: "text-v1-body-lg leading-[1.5] text-v1-frost",
  bodyClassName: "text-v1-body-lg lg:text-v1-body-lg",
  bodyWrap: true,
  // Icons sit in a 90px box, vertically centred (the
  // shorter "Built for AI" glyph is centred and the taller box glyphs
  // fill the height), and render larger than the home cards.
  iconClassName: "items-center",
  iconStyle: { height: "clamp(60px, 6.5vw, 90px)" },
  vectorStyle: { width: "clamp(70px, 7.5vw, 85px)" },
} as const;

// Line-art icons with a white
// stroke (`var(--stroke-0, white)` falls back to white as an <img>), so
// the card's 55→100 icon-opacity transition brightens them on hover/active.
const ICON_DIR = "/assets/v1/compare-temporal/why-choose";

const CARDS: FeatureCard[] = [
  {
    ...CARD_STYLE,
    label: "No workers",
    subtitle: "Zero infrastructure to deploy",
    vector: `${ICON_DIR}/no-workers.svg`,
    vectorWidth: 81,
    vectorHeight: 91, // viewBox 80.98 × 90.75
    bodyLines: [
      "Inngest calls your existing HTTP server – no worker processes, no queue confir, no ops surface to maintain.",
    ],
  },
  {
    ...CARD_STYLE,
    label: "Built for AI",
    subtitle: "Built for how agents actually fail",
    vector: `${ICON_DIR}/built-for-ai.svg`,
    vectorWidth: 86,
    vectorHeight: 61, // viewBox 85.98 × 60.75
    bodyLines: [
      "Step memorization, human-in-the-loop, and per-LLM-call observability – first-class, not bolted on.",
    ],
  },
  {
    ...CARD_STYLE,
    label: "Any runtime",
    subtitle: "TypeScript, Python, Go – or anything with HTTP",
    vector: `${ICON_DIR}/any-runtime.svg`,
    vectorWidth: 81,
    vectorHeight: 91, // viewBox 80.75 × 90.75
    bodyLines: [
      "Temporal’s strongest, SDK is Go, Inngest treats every language as a first-class citizen.",
    ],
  },
];

export default function WhyChoose() {
  return (
    <Section
      aria-labelledby="ct-why-heading"
      className="relative z-10 isolate"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="ct-why-heading"
        // Title wraps to the two lines shown in the design; widen the
        // measure so the break lands as designed.
        titleClassName="lg:max-w-[1100px]"
        title="Why devs choose Inngest over Temporal."
      />
      <div className={`${V1_HEADER_CONTENT_MT} lg:pt-5`}>
        <FeatureCardsGrid cards={CARDS} idleActiveIndex={0} />
      </div>
    </Section>
  );
}
