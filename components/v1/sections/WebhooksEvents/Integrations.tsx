"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import HoverCardShell from "@/components/v1/sections/shared/HoverCardShell";
import InlineCode from "@/components/v1/sections/shared/InlineCode";
import Section from "@/components/v1/sections/shared/Section";
import SectionHeader from "@/components/v1/sections/shared/SectionHeader";

// Brand logos live in /public/assets/v1/webhooks-events/integrations/.

interface Logo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface Integration {
  id: string;
  logo?: Logo;
  /** Fallback wordmark when no PNG logo exists (e.g. "Any Provider"). */
  textLogo?: string;
  body: React.ReactNode;
  link?: { label: string; href: string };
}

const INTEGRATIONS: Integration[] = [
  {
    id: "stripe",
    logo: {
      src: "/assets/v1/webhooks-events/integrations/Stripe.png",
      alt: "Stripe",
      width: 174,
      height: 72,
    },
    body: (
      <>
        Handle payment failures, subscription events, and checkout
        completions — reliably, with step-level retries.
      </>
    ),
    link: { label: "See pattern", href: "/patterns/build-reliable-webhooks" },
  },
  {
    id: "clerk",
    logo: {
      src: "/assets/v1/webhooks-events/integrations/Clerk.png",
      alt: "Clerk",
      width: 221,
      height: 64,
    },
    body: (
      <>
        Fan-out on <InlineCode>user.created</InlineCode> — sync DB,
        send welcome email, start trial, all in parallel.
      </>
    ),
    link: { label: "Read guide", href: "#" },
  },
  {
    id: "github",
    logo: {
      src: "/assets/v1/webhooks-events/integrations/Github.png",
      alt: "GitHub",
      width: 292,
      height: 72,
    },
    body: (
      <>
        Trigger deploys, run CI checks, and notify teams on push,
        PR, and release events.
      </>
    ),
  },
  {
    id: "resend",
    logo: {
      src: "/assets/v1/webhooks-events/integrations/Resend.png",
      alt: "Resend",
      width: 240,
      height: 60,
    },
    body: (
      <>
        React to bounces, opens, and clicks to build dynamic drip
        campaigns and clean your lists automatically.
      </>
    ),
    link: { label: "Read guide", href: "#" },
  },
  {
    id: "shopify",
    logo: {
      src: "/assets/v1/webhooks-events/integrations/Shopify.png",
      alt: "Shopify",
      width: 308,
      height: 88,
    },
    body: (
      <>
        Process orders, sync inventory, trigger post-purchase flows
        on <InlineCode>orders/create</InlineCode> and more.
      </>
    ),
  },
  {
    id: "any",
    textLogo: "Any Provider",
    body: (
      <>
        If it sends an HTTP POST, Inngest can receive it. Write a
        short transform to normalize the payload and you're done.
      </>
    ),
    link: { label: "Docs", href: "/docs/platform/webhooks" },
  },
];

export default function Integrations() {
  return (
    <Section
      aria-labelledby="we-integrations-heading"
      className="relative"
      containerClassName="flex flex-col gap-v1-stack"
    >
      <SectionHeader
        id="we-integrations-heading"
        eyebrow="Integrations"
        title={
          <>
            <span className="block">Works with</span>
            <span className="block">everything you use.</span>
          </>
        }
        body="Point any webhook URL at Inngest and start writing functions in minutes."
        bodyClassName="max-w-[480px]"
      />

      {/* -mx-5 cancels each card's px-5 so logos sit flush with the heading. */}
      <ul className="-mx-5 grid list-none grid-cols-1 gap-x-4 gap-y-2 pl-0 sm:grid-cols-2 sm:gap-y-6">
        {INTEGRATIONS.map((it, i) => (
          <motion.li key={it.id} {...reveals.item(i)}>
            <IntegrationCard integration={it} />
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <HoverCardShell
      href={integration.link?.href}
      className="px-5 py-6 lg:pr-16"
    >
      <div className="flex h-9 items-center">
        {integration.logo ? (
          <Image
            src={integration.logo.src}
            alt={integration.logo.alt}
            width={integration.logo.width}
            height={integration.logo.height}
            className="h-8 w-auto object-contain"
          />
        ) : (
          <span className="text-v1-heading-md text-v1-frost">
            {integration.textLogo}
          </span>
        )}
      </div>

      <p className="mt-5 text-v1-body-lg">{integration.body}</p>

      {integration.link && (
        <span className="mt-7 self-start text-v1-label-md uppercase text-v1-frost motion-safe:transition-colors motion-safe:duration-300 group-hover:text-v1-accent-salmon">
          {integration.link.label}
          <span
            aria-hidden="true"
            className="ml-2 inline-block ease-v1-in motion-safe:transition-transform motion-safe:duration-[400ms] group-hover:translate-x-[6px]"
          >
            →
          </span>
        </span>
      )}
    </HoverCardShell>
  );
}

