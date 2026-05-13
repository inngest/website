import Link from "next/link";

import Header from "../../shared/Header";
import Footer from "../../shared/Footer";
import Container from "../../shared/layout/Container";
import ArrowRight from "src/shared/Icons/ArrowRight";
import PATTERNS_DATA, { type PatternSection } from "./patternsData";

// ── Helpers ──────────────────────────────────────────────────────────────────

const totalPatterns = PATTERNS_DATA.reduce(
  (sum, s) => sum + s.patterns.length,
  0
);

// ── Section components ───────────────────────────────────────────────────────

function SectionRule({ section }: { section: PatternSection }) {
  return (
    <div className="mb-10 grid grid-cols-[auto_1fr_auto] items-center gap-6 border-t border-subtle pt-5">
      <div className="flex items-baseline gap-3.5">
        <span className={`font-mono text-xs tracking-widest ${section.accent.text}`}>
          {section.number}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
          {section.name}
        </span>
      </div>
      <div
        className={`h-px bg-gradient-to-r ${section.accent.gradient} opacity-55`}
      />
      <span className="font-mono text-[11px] tracking-widest text-muted">
        {section.patterns.length} PATTERNS
      </span>
    </div>
  );
}

function PatternRow({
  slug,
  title,
  subtitle,
  accentText,
}: {
  slug: string;
  title: string;
  subtitle: string;
  accentText: string;
}) {
  return (
    <Link
      href={`/patterns/${slug}`}
      className="group grid grid-cols-[1fr_auto] items-center gap-4 border-b border-subtle bg-canvasBase px-5 py-4 transition-colors hover:bg-surfaceSubtle"
    >
      <div className="flex flex-col gap-1">
        <span className="text-[15px] font-medium tracking-tight text-basis">
          {title}
        </span>
        <span className="text-[13px] leading-relaxed text-subtle">
          {subtitle}
        </span>
      </div>
      <span className={`flex text-muted transition-all group-hover:translate-x-0.5 group-hover:${accentText}`}>
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

function PatternSection({
  section,
  featured = false,
}: {
  section: PatternSection;
  featured?: boolean;
}) {
  return (
    <section id={section.id} className="scroll-mt-20">
      <SectionRule section={section} />

      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="max-w-[540px]">
          <p
            className={`mb-5 font-mono text-[11px] uppercase tracking-[0.16em] ${section.accent.text}`}
          >
            {section.kicker}
          </p>
          <h2
            className={`mb-6 font-heading tracking-tight text-basis ${
              featured
                ? "text-5xl font-medium lg:text-7xl"
                : "text-4xl font-medium lg:text-6xl"
            }`}
            style={{ lineHeight: 1 }}
          >
            {section.name}
          </h2>
          <p
            className={`mb-8 leading-relaxed text-subtle ${
              featured ? "text-lg" : "text-base"
            }`}
            style={{ textWrap: "pretty" }}
          >
            {section.description}
          </p>
          <Link
            href={`#${section.id}`}
            className={`inline-flex items-center gap-2.5 rounded border border-muted bg-surfaceSubtle px-4 py-2.5 text-[13px] text-basis transition-colors hover:${section.accent.border} hover:${section.accent.text}`}
          >
            Explore patterns
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Pattern list */}
        <div className="overflow-hidden rounded border border-subtle">
          {section.patterns.map((p) => (
            <PatternRow
              key={p.slug}
              slug={p.slug}
              title={p.title}
              subtitle={p.subtitle}
              accentText={section.accent.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export async function getStaticProps() {
  return {
    props: {
      designVersion: "2",
      meta: {
        title: "Patterns — How to build with Inngest",
        description:
          "Production-tested patterns for AI agents, durable workflows, and the event-driven systems they live in.",
        image: "/assets/patterns/og-image-patterns.jpg",
      },
    },
  };
}

export default function Patterns() {
  return (
    <div className="bg-canvasBase">
      <Header />

      {/* Hero */}
      <Container className="pb-24 pt-32">
        <h1
          className="mb-10 max-w-[14ch] font-heading text-6xl font-medium tracking-tight text-basis md:text-8xl lg:text-[132px]"
          style={{ lineHeight: 0.94 }}
        >
          How to build
          <br />
          with <em className="font-normal not-italic text-cta">Inngest</em>.
        </h1>

        <p
          className="mb-20 max-w-xl text-lg leading-relaxed text-subtle"
          style={{ textWrap: "pretty" }}
        >
          Production-tested patterns for AI agents, durable workflows, and the
          event-driven systems they live in. Each pattern is built on Inngest
          primitives — steps, events, throttling, schedules, channels — and the
          guarantees they provide.
        </p>

        <div className="flex max-w-xl gap-14 border-t border-subtle pt-8">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-4xl text-basis">{totalPatterns}</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Patterns
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-4xl text-basis">
              {PATTERNS_DATA.length}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Primitives
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-4xl text-basis">3</span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Languages
            </span>
          </div>
        </div>
      </Container>

      {/* Sections */}
      <Container className="flex flex-col gap-20 pb-32">
        {PATTERNS_DATA.map((section, idx) => (
          <PatternSection
            key={section.id}
            section={section}
            featured={idx === 0}
          />
        ))}
      </Container>

      <Footer />
    </div>
  );
}
