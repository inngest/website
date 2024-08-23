"use client";
import { useSelectedLayoutSegment } from "next/navigation";

import Command from "./Command";
import { Button } from "src/shared/Button";

export function FullWidthCTA({
  title = "Ready to start building?",
  description = "Ship reliable code without manage queues, infrastructure, or state",
  ctaHref = process.env.NEXT_PUBLIC_SIGNUP_URL,
  ctaText = "Start building for free",
  ctaRef,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  ctaHref?: string;
  ctaText?: string;
  ctaRef?: string;
}) {
  let layoutSegment = "footer";
  try {
    layoutSegment = useSelectedLayoutSegment();
  } catch (e) {
    /* noop */
  }

  let ref = "callout";
  if (!ctaRef) {
    ref = `${layoutSegment}-callout`;
  }
  return (
    <section
      className={`
      relative pt-40 pb-20
      flex flex-col gap-12 items-center text-center justify-center
      bg-[url(/assets/textures/blob-background-footer-cta.png)] bg-cover bg-no-repeat bg-top
      text-white
    `}
    >
      <h2 className="text-3xl md:text-6xl font-bold">{title}</h2>
      <p className="text-lg md:text-xl font-semibold">{description}</p>
      <div className="flex flex-col gap-4">
        {/* <Command command="npx inngest-cli@latest dev" /> */}
        <Button href={`${ctaHref}?ref=${ref}`} variant="dark">
          {ctaText}
        </Button>
      </div>
    </section>
  );
}
