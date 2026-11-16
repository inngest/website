import Image from "next/image";
import Link from "next/link";
import {
  LOGO_HEIGHT,
  STORIES,
  STORY_HREF,
} from "@/components/v1/sections/Customers/data";
import { refLinkProps } from "@/utils/v1/ref";

// Quotes from early-stage teams, placed between the application form and
// the FAQ. Quotes are copied word for word from the customer stories and
// testimonials already on the site; logos and links come from the shared
// customer STORIES data so they stay in sync with /customers.
const QUOTES: {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
}[] = [
  {
    id: "day-ai",
    quote:
      "Inngest is like the nervous system of Day AI, it makes things reliable by default so we can focus on building.",
    authorName: "Erik Munson",
    authorTitle: "Founding Engineer, Day AI",
  },
  {
    id: "outtake",
    quote:
      "Inngest gives us fine-grained control over errors, and how they propagate, so we can just focus on what the agents should do, not what to do when they fail.",
    authorName: "Diego Escobedo",
    authorTitle: "Founding Engineer, Outtake",
  },
  {
    id: "featured",
    quote:
      "Inngest helps our trains (workflows) run; without losing sleep or manually shoveling coal into an engine.",
    authorName: "Brett Farmiloe",
    authorTitle: "CTO, Featured",
  },
];

export default function StartupStories() {
  const cards = QUOTES.map((q) => {
    const story = STORIES.find((s) => s.id === q.id);
    if (!story) throw new Error(`Missing customer story: ${q.id}`);
    return { ...q, story };
  });

  return (
    <section
      aria-labelledby="startups-stories-heading"
      className="mx-auto w-full max-w-[1440px] px-6 pt-20 text-v1-frost sm:px-9 sm:pt-24 lg:px-[70px] lg:pt-28"
    >
      <h2
        id="startups-stories-heading"
        className="text-v1-heading-md text-center text-v1-frost"
      >
        Startups building on Inngest
      </h2>

      <ul className="mt-10 grid list-none grid-cols-1 gap-6 pl-0 md:grid-cols-3 lg:mt-12">
        {cards.map(({ id, quote, authorName, authorTitle, story }) => {
          const logoHeight = story.logoHeight ?? LOGO_HEIGHT;
          return (
            <li key={id} className="list-none">
              <Link
                {...refLinkProps(`${STORY_HREF(id)}?ref=startups-stories`)}
                className="group/card flex h-full flex-col gap-6 rounded-[8px] border border-v1-steel/20 bg-[linear-gradient(297deg,rgba(33,33,33,0)_-2.25%,#020202_46.83%)] p-6 sm:p-8 motion-safe:transition-colors hover:border-v1-steel/50"
              >
                <span className="flex h-10 items-center">
                  <Image
                    src={story.logo}
                    alt={story.brand}
                    width={logoHeight * 8}
                    height={logoHeight}
                    style={{ height: logoHeight, width: "auto" }}
                    className="block object-contain object-left"
                    unoptimized
                  />
                </span>
                <blockquote className="text-v1-body-sm-loose flex-1 text-v1-frost/90">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <p className="text-v1-caption text-v1-frost/60">
                  <span className="block text-v1-frost">{authorName}</span>
                  <span className="block">{authorTitle}</span>
                </p>
                <span className="text-v1-label-sm inline-flex items-baseline uppercase text-v1-frost motion-safe:transition-colors group-hover/card:text-v1-accent-salmon">
                  Read the story
                  <span
                    aria-hidden="true"
                    className="ml-2 inline-block motion-safe:transition-transform group-hover/card:translate-x-[6px]"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
