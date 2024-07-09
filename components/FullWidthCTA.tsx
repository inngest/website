"use client";
import { useSelectedLayoutSegment } from "next/navigation";

import Command from "./Command";
import { Button } from "src/shared/Button";

export function FullWidthCTA({
  ctaHref = process.env.NEXT_PUBLIC_SIGNUP_URL,
  ctaText = "Start building for free",
  ctaRef,
}: {
  ctaHref?: string;
  ctaText?: string;
  ctaRef?: string;
}) {
  const layoutSegment = useSelectedLayoutSegment();
  let ref = "callout";
  if (!ctaRef) {
    ref = `${layoutSegment}-callout`;
  }
  return (
    <section
      className={`
      relative pt-40 pb-20
      flex flex-col gap-12 items-center text-center justify-center
      bg-[url(/assets/textures/blob-background-2.png)] bg-cover bg-no-repeat bg-bottom
      text-white
    `}
    >
      <h2 className="text-3xl md:text-6xl font-bold">
        Ready to start building?
      </h2>
      <p className="text-lg md:text-xl font-semibold">
        Ship more reliable background functions and workflows today
      </p>
      <div className="flex flex-col gap-4">
        {/* <Command command="npx inngest-cli@latest dev" /> */}
        <Button href={`${ctaHref}?ref=${ref}`} variant="tertiary">
          {ctaText}
        </Button>
      </div>
    </section>
  );
}
