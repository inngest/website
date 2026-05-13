import React from "react";
import Link from "next/link";

import Header from "../../shared/Header";
import Footer from "../../shared/Footer";
import Container from "../../shared/layout/Container";
import ArrowRight from "src/shared/Icons/ArrowRight";

interface Section {
  title: string;
  articles: {
    title: string;
    subtitle: string;
    tags: string[];
    slug: string;
  }[];
}

export const SECTIONS: Section[] = [
  {
    title: "Flow Control",
    articles: [
      {
        title: "Flash sales and bursty workflows",
        subtitle:
          "Use throttle, concurrency, debounce, and idempotency to handle traffic spikes without overwhelming downstream services",
        tags: ["Flow Control", "Reliability"],
        slug: "flash-sales-and-bursty-workflows",
      },
      {
        title: "Keeping your API fast",
        subtitle:
          "Offload LLM calls, data processing, and other heavy work from the request path into reliable background functions",
        tags: ["Performance", "AI"],
        slug: "keeping-your-api-fast",
      },
      {
        title: "Build reliable webhooks",
        subtitle:
          "Ingest webhooks and model callbacks at scale with built-in retries and replay",
        tags: ["Reliability", "Integrations"],
        slug: "build-reliable-webhooks",
      },
    ],
  },
  {
    title: "Durable Workflows",
    articles: [
      {
        title: "Reliably run critical workflows",
        subtitle:
          "Break multi-step AI pipelines and complex business logic into durable, independently retried steps",
        tags: ["Durability", "AI"],
        slug: "reliably-run-critical-workflows",
      },
      {
        title: "Running functions in parallel",
        subtitle:
          "Fan out to multiple model calls, evaluations, or processing tasks from a single event",
        tags: ["Architecture", "AI"],
        slug: "running-functions-in-parallel",
      },
    ],
  },
  {
    title: "Event Coordination",
    articles: [
      {
        title: "Building flows for lost customers",
        subtitle:
          "Coordinate between events to build human-in-the-loop approvals, cart abandonment flows, and multi-step user journeys",
        tags: ["Event Coordination", "User Journeys"],
        slug: "event-coordination-for-lost-customers",
      },
    ],
  },
];

const zeroPad = (n: number, digits = 2): string => {
  const ns = n.toString();
  const len = ns.length;
  return len >= digits ? ns : `${new Array(digits - len + 1).join("0")}${n}`;
};

export async function getStaticProps() {
  return {
    props: {
      designVersion: "2",
      meta: {
        title: "Patterns: AI Orchestration + Durable Workflows",
        description:
          "Architecture patterns for building reliable AI pipelines, background jobs, and event-driven workflows",
        image: "/assets/patterns/og-image-patterns.jpg",
      },
    },
  };
}

export default function Patterns() {
  return (
    <div>
      <Header />

      <div>
        <Container>
          <h1 className="mt-12 text-3xl font-semibold tracking-tight text-basis md:mt-20 lg:text-5xl">
            Patterns
          </h1>
          <p className="text-xl text-basis">AI Orchestration + Durable Workflows</p>
          <p className="my-4 mb-16 max-w-xl text-subtle md:mb-28">
            Proven approaches for building reliable AI pipelines, handling
            traffic spikes, and coordinating complex workflows with Inngest.
          </p>

          <section className="flex flex-col gap-12">
            {/* Content layout */}

            {SECTIONS.map((s, idx) => (
              <div
                key={s.title}
                className="flex flex-col gap-y-6 rounded-lg md:px-3 md:py-6 lg:p-6 xl:grid xl:grid-cols-4 xl:gap-y-8"
              >
                <div className="flex items-center gap-4 xl:block">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-surfaceMuted text-lg font-bold text-basis">
                    {zeroPad(idx + 1)}
                  </div>
                  <h2 className="text-xl font-medium tracking-tight text-basis xl:mt-4">
                    {s.title}
                  </h2>
                </div>
                <div className="col-span-3 grid gap-x-6 gap-y-6 md:grid-cols-2">
                  {s.articles.map(({ title, subtitle, tags, slug }) => (
                    <Link
                      key={slug}
                      href={`/patterns/${slug}`}
                      className="group/card flex flex-col justify-between rounded-lg bg-surfaceSubtle transition-all hover:drop-shadow-[0_0_35px_rgba(124,124,124,0.25)]"
                    >
                      <div className="flex h-full flex-col justify-between px-6 py-4 lg:px-8 lg:py-6">
                        <div>
                          <h2 className="text-lg font-semibold tracking-tight text-basis">
                            {title}
                          </h2>
                          <p className="font-regular mb-3 mt-1 text-sm tracking-tight text-subtle">
                            {subtitle}.
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-medium text-link transition-all group-hover/card:underline">
                          Read pattern
                          <ArrowRight className="-mr-1.5 transition-transform duration-150  group-hover/card:translate-x-1" />
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 rounded-b-lg border-t border-subtle bg-carbon-500/10 px-6 py-3 transition-all">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-surfaceBase px-2 py-1 text-xs font-medium text-basis"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
