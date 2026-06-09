import { type Slide } from "./TestimonialsCarousel";

/**
 * Shared testimonial slide decks. Both are consumed across multiple
 * pages (home, webhooks, background-jobs use the "home" deck; AI,
 * queues/flow-control, download-gate use the "AI" deck), so they live
 * here as a single source of truth rather than under any one page's
 * section folder. Page-specific decks (e.g. CompareTemporal's
 * Temporal-switchers) stay local to that page.
 */

// ─── Home deck (Otto / Outtake / Day.ai) ───────────────────────────

const PORTRAIT_OTTO = "/assets/v1/customers/otto-sully-omar.png";
const PORTRAIT_OUTTAKE = "/assets/v1/customers/outtake-diego-escobedo.png";
const PORTRAIT_DAYAI = "/assets/v1/customers/dayai-erik-munson.png";

export const HOME_TESTIMONIAL_SLIDES: Slide[] = [
  {
    id: "cohere",
    label: "Cohere",
    logo: { src: "/assets/v1/logos/cohere.svg", width: 208, height: 32 },
    testimonial: {
      quote:
        "Inngest completely transformed how we handle AI orchestration at Cohere. Its intuitive developer experience, built-in multi-tenant concurrency, and flow control allowed us to scale without the complexity of other tools or the need to build custom solutions. What would have taken us a month.",
      authorName: "Sully Omar",
      authorTitle: "Co-Founder - Cohere",
      caseStudyHref: "#",
      portrait: PORTRAIT_OTTO,
      portraitAlt: "Sully Omar, Co-Founder at Cohere",
    },
  },
  {
    id: "outtake",
    label: "Outtake",
    logo: { src: "/assets/v1/logos/outtake.svg", width: 181, height: 32 },
    testimonial: {
      quote:
        "Our pipelines have many interdependent components chained together. Lots can go wrong in that workflow—including unpredictable behavior from the models themselves. Inngest gives us fine-grained control over errors, and how they propagate, so we can just focus on what the agents should do, not what to do when they fail.",
      authorName: "Diego Escobedo",
      authorTitle: "Founding Engineer",
      caseStudyHref: "#",
      portrait: PORTRAIT_OUTTAKE,
      portraitAlt: "Diego Escobedo, Founding Engineer at Outtake",
    },
  },
  {
    id: "day-ai",
    label: "Day.ai",
    logo: { src: "/assets/v1/logos/day-ai.svg", width: 159, height: 50 },
    testimonial: {
      quote:
        "Day AI is a complex network of LLMs, data processing, and 3rd party services. Every component in the system needs to wake up at the right times, run for long periods of time, and react intelligently to behavior in other components. Inngest is like the nervous system for all of that, it makes things reliable by default so we can focus on building.",
      authorName: "Erik Munson",
      authorTitle: "Founding Engineer",
      caseStudyHref: "#",
      portrait: PORTRAIT_DAYAI,
      portraitAlt: "Erik Munson, Founding Engineer at Day.ai",
    },
  },
];

// ─── AI deck (ElevenLabs / Avoca / 11x) ─────────────────────────────

const PORTRAIT_DAVID = "/assets/v1/customers/test-carousel-0.png";
const PORTRAIT_AVOCA = "/assets/v1/customers/test-carousel-1.png";
const PORTRAIT_11X = "/assets/v1/customers/test-carousel-2.png";

export const AI_TESTIMONIAL_SLIDES: Slide[] = [
  {
    id: "elevenlabs",
    label: "ElevenLabs",
    logo: { src: "/assets/v1/logos/elevenlabs.svg", width: 185, height: 24 },
    testimonial: {
      quote:
        "For anyone who is building multi-step AI agents, I highly recommend building it on top of Inngest, the traceability it provides is super useful, plus you get timeouts & retries for free.",
      quoteLines: [
        "For anyone who is building multi-step AI agents, I",
        "highly recommend building it on top of Inngest,",
        "the traceability it provides is super useful, plus you",
        "get timeouts & retries for free.",
      ],
      authorName: "David Zhang",
      authorTitle: "CEO / Co-Founder",
      caseStudyHref: "#",
      portrait: PORTRAIT_DAVID,
      portraitAlt: "David Zhang, CEO and Co-Founder at ElevenLabs",
    },
  },
  {
    id: "avoca",
    label: "Avoca",
    logo: { src: "/assets/v1/logos/avoca.svg", width: 162, height: 40 },
    testimonial: {
      quote:
        "Inngest lets us iterate on agent flows without standing up our own queue or worker pool — built-in retries and timeouts mean we focus on prompt and tool design instead of infra.",
      quoteLines: [
        "Inngest lets us iterate on agent flows without standing",
        "up our own queue or worker pool — built-in retries",
        "and timeouts mean we focus on prompt and tool",
        "design instead of infra.",
      ],
      authorName: "Jordan Lee",
      authorTitle: "Head of Engineering",
      caseStudyHref: "#",
      portrait: PORTRAIT_AVOCA,
      portraitAlt: "Jordan Lee, Head of Engineering at Avoca",
    },
  },
  {
    id: "11x",
    label: "11x",
    logo: { src: "/assets/v1/logos/11x.svg", width: 104, height: 37 },
    testimonial: {
      quote:
        "We replaced thousands of lines of orchestration code with Inngest functions. Long-running agent workflows now resume from any step on failure — that alone has been a step change.",
      quoteLines: [
        "We replaced thousands of lines of orchestration",
        "code with Inngest functions. Long-running agent",
        "workflows now resume from any step on failure —",
        "that alone has been a step change.",
      ],
      authorName: "Sam Park",
      authorTitle: "Founding Engineer",
      caseStudyHref: "#",
      portrait: PORTRAIT_11X,
      portraitAlt: "Sam Park, Founding Engineer at 11x",
    },
  },
];
