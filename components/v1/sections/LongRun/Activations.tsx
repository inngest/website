"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";
import { V1_HEADER_CONTENT_MT } from "@/components/v1/sections/shared/sectionShell";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";
import { isPastEvent } from "@/components/v1/sections/Events/data";
import {
  sortActivations,
  type Activation,
} from "@/components/v1/sections/LongRun/data";

/**
 * Where to find us on the ground. The counterpart to the in-person
 * program: someone who met us at a run club or picked up a sponsored
 * drink lands here to find out what else is happening.
 *
 * Carries both tenses on purpose. Past activations stay on the page
 * rather than being pruned, because they're the evidence the campaign is
 * a standing thing and not one flyer — the same reason /events keeps its
 * archive. Ordering matches /events too: upcoming soonest-first, then
 * past newest-first.
 *
 * `isPastEvent` is imported from the events module rather than
 * reimplemented, so "is it over yet" has one definition on the site — it
 * already handles the multi-day case where a start date alone would mark
 * something past on its own opening morning.
 */
export default function Activations({
  city,
  activations,
}: {
  city: string;
  activations: Activation[];
}) {
  // Sorted per render rather than at module scope: the upcoming/past
  // split depends on the current time, and a module-level constant would
  // freeze the build time into a statically rendered page.
  const ordered = sortActivations(activations, isPastEvent);
  const upcomingCount = ordered.filter(
    (a) => a.ongoing || !isPastEvent(a)
  ).length;

  return (
    <Section
      aria-labelledby="long-run-activations-heading"
      containerClassName="flex flex-col"
    >
      <SectionHeader
        id="long-run-activations-heading"
        eyebrow={`On the ground in ${city}`}
        title={<>Come find us on the course.</>}
        body="We're spending the season where people building long-running things actually are — early mornings, late nights, and a few places in between. Everything here is open; nothing here is a demo."
        bodyClassName="max-w-[655px]"
      />

      <ol
        className={cn(
          V1_HEADER_CONTENT_MT,
          "grid list-none grid-cols-1 gap-x-8 gap-y-10 pl-0 lg:grid-cols-2 lg:gap-y-12"
        )}
      >
        {ordered.map((a, i) => {
          // `ongoing` outranks the date: a standing sponsorship whose
          // window has technically opened is still live, not past.
          const past = !a.ongoing && isPastEvent(a);
          return (
            <motion.li
              key={a.id}
              {...reveals.item(i)}
              className={cn(
                "flex list-none flex-col gap-4 border-t pt-8",
                past ? "border-v1-subtle opacity-60" : "border-v1-accent-salmon"
              )}
            >
              <div className="flex flex-wrap items-center gap-3">
                <StatusTag past={past} ongoing={a.ongoing} />
                <p className="text-v1-label-sm uppercase text-v1-frost/55">
                  {a.when}
                </p>
              </div>

              <h3 className="text-v1-heading-card text-v1-frost">{a.title}</h3>

              <p className="text-v1-label-sm uppercase text-v1-accent-salmon-light">
                {a.venue} · {a.neighborhood}
              </p>

              <p className="text-v1-body-sm-loose">{a.body}</p>

              {/* A past activation keeps its copy but drops its CTA —
                  an RSVP link to something that already happened is a
                  dead end, and the entry is here as evidence now. */}
              {a.href && !past && (
                <Link
                  href={a.href}
                  {...(a.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-v1-label-md uppercase text-v1-frost transition-opacity duration-200 hover:opacity-70"
                >
                  {a.linkLabel ?? "Details"}{" "}
                  <span
                    aria-hidden="true"
                    className="text-v1-accent-salmon-light"
                  >
                    →
                  </span>
                </Link>
              )}
            </motion.li>
          );
        })}
      </ol>

      {upcomingCount === 0 && (
        <p className="text-v1-body-lg-loose mt-v1-stack text-v1-frost/70">
          Nothing on the calendar this minute — the next one goes up here first.
        </p>
      )}
    </Section>
  );
}

/** Upcoming / Ongoing / Past, as a small uppercase tag on the card. */
function StatusTag({ past, ongoing }: { past: boolean; ongoing?: boolean }) {
  const label = past ? "We were there" : ongoing ? "Ongoing" : "Upcoming";
  return (
    <span
      className={cn(
        "text-v1-label-sm inline-flex items-center gap-2 uppercase",
        past ? "text-v1-frost/55" : "text-v1-frost"
      )}
    >
      {!past && (
        <span
          aria-hidden="true"
          className="block h-[7px] w-[7px] rounded-full bg-v1-accent-salmon"
        />
      )}
      {label}
    </span>
  );
}
