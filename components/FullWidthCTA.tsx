"use client";
import { useSelectedLayoutSegment } from "next/navigation";

import Command from "./Command";
import { Button, type ButtonVariant } from "src/shared/Button";

type CTA = {
  href: string;
  text: string;
  variant?: ButtonVariant;
};

export function FullWidthCTA({
  title = "Ready to start building?",
  description = "Ship reliable code without manage queues, infrastructure, or state",
  ctas = [
    {
      href: process.env.NEXT_PUBLIC_SIGNUP_URL,
      text: "Start building for free",
    },
  ],
  ctaRef,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  ctas?: CTA[];
  ctaRef?: string;
}) {
  let layoutSegment = "footer";
  try {
    const segment = useSelectedLayoutSegment();
    if (segment) {
      layoutSegment = segment;
    }
  } catch (e) {
    /* noop */
  }
  const ref = ctaRef ?? `${layoutSegment}-callout`;
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
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* <Command command="npx inngest-cli@latest dev" /> */}
        {ctas.map(({ href, text, variant = "dark" }, idx) => (
          <Button href={`${href}?ref=${ref}`} key={idx} variant={variant}>
            {text}
          </Button>
        ))}
      </div>
    </section>
  );
}
