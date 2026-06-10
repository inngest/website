import { appendRef } from "@/utils/v1/ref";
import HoverCardShell from "@/components/v1/sections/shared/HoverCardShell";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

interface Quickstart {
  eyebrow: string;
  title: string;
  href: string;
}

// Three language quickstarts, each linking to its docs getting-started
// guide. (Replaces the old language-picker tablist that swapped one
// language's Quickstart/AI/Non-AI trio in and out.)
const QUICKSTARTS: Quickstart[] = [
  {
    eyebrow: "Quickstart",
    title: "Next.js",
    href: "/docs/getting-started/nextjs-quick-start",
  },
  {
    eyebrow: "Quickstart",
    title: "Node.js",
    href: "/docs/getting-started/nodejs-quick-start",
  },
  {
    eyebrow: "Quickstart",
    title: "Python",
    href: "/docs/reference/python",
  },
];

export default function StartBuilding() {
  return (
    <Section
      aria-label="Start building"
      className="relative"
      containerClassName="flex flex-col gap-[58px]"
    >
      <SectionHeader
        // Inset at lg to match the cards' px-4 content offset, so the
        // title/subtitle align with the "QUICKSTART" eyebrow below.
        // Tighter title→subtitle gap than the default 48px v1-stack.
        className="lg:pl-4 !gap-5"
        titleClassName="text-balance"
        title="Start Building"
        body="Pick a template"
        // Larger heading-sm lead (not the default body-lg-loose);
        // frost since it reads as a sub-heading.
        bodyClassName="text-v1-heading-sm text-v1-frost"
      />

      <ul className="grid grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-3 lg:gap-y-12">
        {QUICKSTARTS.map((q) => (
          <li key={q.title}>
            <QuickstartCard quickstart={q} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function QuickstartCard({ quickstart }: { quickstart: Quickstart }) {
  return (
    // -mx-4 / lg:mx-0 lets the hover border bleed past the content
    // edge on mobile (where the grid sits flush to the viewport)
    // but tucks back inside the grid at lg+.
    <HoverCardShell
      href={appendRef(quickstart.href, "home-start-building")}
      className="gap-8 -mx-4 px-4 pb-6 pt-5 lg:mx-0"
    >
      <div className="flex flex-col gap-2.5">
        {/* `mr-2` (animated with width) instead of flex gap so the
            row stays collapsed at rest — gap would reserve 8px at
            zero block width. */}
        <div className="flex items-center">
          <span
            aria-hidden="true"
            className="block h-[10px] w-0 origin-center scale-y-0 bg-v1-accent-salmon ease-v1-in motion-safe:transition-[width,margin,transform] motion-safe:duration-[450ms] group-hover:mr-2 group-hover:w-[2px] group-hover:scale-y-100"
          />
          <p className="text-v1-label-md uppercase motion-safe:transition-colors motion-safe:duration-[400ms] group-hover:text-v1-accent-salmon">
            {quickstart.eyebrow}
          </p>
        </div>
        {/* Raw utilities (not text-v1-heading-card) because the design
            specs lh=font-size here while the token is calibrated looser. */}
        <h3 className="max-w-[310px] font-whyte text-[24px] font-normal leading-[32px] mt-1 lg:text-[32px]">
          {quickstart.title}
        </h3>
      </div>
      {/* Arrow renders at all breakpoints — same affordance the
          card carries everywhere; no separate mobile underline. */}
      <span className="text-v1-label-md uppercase motion-safe:transition-colors motion-safe:duration-300 group-hover:text-v1-accent-salmon">
        Get Started
        <span
          aria-hidden="true"
          className="ml-2 inline-block motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in group-hover:translate-x-[6px]"
        >
          →
        </span>
      </span>
    </HoverCardShell>
  );
}
