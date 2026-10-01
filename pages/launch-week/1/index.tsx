import type { GetStaticPropsResult } from "next";
import Image from "next/image";
import { useRef, useState } from "react";
import clsx from "clsx";

import Header from "src/shared/Header";
import Logo from "src/shared/Icons/Logo";
import Container from "src/shared/layout/Container";
import Footer from "src/shared/Footer";
import type { PageProps } from "src/shared/types";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<PageProps>
> {
  return {
    props: {
      meta: {
        title: "Inngest Launch Week",
        description:
          "A week of updates from Inngest starting January 22nd, 2024",
        image: "/assets/launch-week/og.png",
      },
    },
  };
}

export default function LaunchWeek() {
  return (
    <div className="home bg-slate-1000 bg-[url(/assets/launch-week/background-image.png)] bg-cover bg-fixed font-sans">
      <Header />
      <Container className="py-8">
        <div className="my-12 flex items-center justify-center tracking-tight">
          <div className="rounded-md py-8 md:py-16">
            <div className="flex justify-center">
              <Logo fill={"#ffffff"} width={260} />
            </div>
            <h1 className="mb-4 text-center text-5xl font-bold leading-tight text-white md:text-7xl md:leading-tight">
              <span className="bg-gradient-to-br bg-gradient-to-r from-[#5EEAD4] via-[#A7F3D0] to-[#FDE68A] bg-clip-text text-transparent">
                Launch Week
              </span>
            </h1>
            <RowItem
              title="Launch week recap"
              subtitle="The tl;dr of this week's updates"
              image="/assets/launch-week/og.png"
              label="Recap"
              buttonHref="/blog/launch-week-recap"
              orientation="right"
            />
          </div>
        </div>

        <Heading title="Monday" />
        <RowItem
          title="Inngest Replay"
          subtitle="The death of the dead-letter queue"
          image="/assets/blog/announcing-replay/featured-image.png"
          label="New"
          buttonHref="/blog/announcing-replay-the-death-of-the-dead-letter-queue"
          docsHref="/docs/platform/replay"
          orientation="left"
        />
        <RowItem
          title="Bulk cancellation"
          subtitle="Cancel functions within a time range with the API"
          image="/assets/blog/bulk-cancellation-api/featured-image.png"
          label="New"
          buttonHref="/blog/bulk-cancellation-api"
          docsHref="/docs/guides/cancel-running-functions"
          orientation="right"
        />
        <RowItem
          title="How we built a fair multi-tenant queuing system"
          subtitle="Building the Inngest queue - Part I"
          image="/assets/blog/inngest-queue-pt-i/featured-image-v2.png"
          label="Technical post"
          buttonHref="/blog/building-the-inngest-queue-pt-i-fairness-multi-tenancy"
          orientation="left"
        />

        <Heading title="Tuesday" />
        <RowItem
          title="Cross-language support and new Inngest SDKs"
          subtitle="Python, Go, with more to come"
          image="/assets/blog/cross-language-support-with-new-sdks/featured-image.png"
          label="New"
          buttonHref="/blog/cross-language-support-with-new-sdks"
          orientation="right"
        />
        <RowItem
          title="Migrating long running workflows across clouds with zero downtime"
          subtitle="How the Inngest system is designed to help you migrate with minimal effort"
          image="/assets/blog/migrating-across-clouds-with-zero-downtime/featured-image.png"
          label="New"
          buttonHref="/blog/migrating-across-clouds-with-zero-downtime"
          docsHref="/docs/apps/cloud"
          orientation="left"
        />

        <Heading title="Wednesday" />
        <RowItem
          title="Building auth workflows with Clerk webhooks"
          subtitle="A new webhook integration with Clerk"
          image="/assets/blog/building-auth-workflows-with-clerk-integration/featured-image.png"
          label="New"
          buttonHref="/blog/building-auth-workflows-with-clerk-integration"
          docsHref="/docs/guides/clerk-webhook-events"
          orientation="right"
        />
        <RowItem
          title="Svix + Inngest: Reliable Webhook Delivery and Execution"
          subtitle="A new integration for Svix customers"
          image="/assets/blog/svix-integration/featured-image.png"
          label="New"
          buttonHref="/blog/svix-integration"
          orientation="left"
        />

        <Heading title="Thursday" />
        <RowItem
          title="Improved error handling in Inngest SDKs"
          subtitle="Perform rollbacks, cleanups, and more"
          image="/assets/blog/improved-error-handling/featured-image.png"
          label="New"
          buttonHref="/blog/improved-error-handling"
          docsHref="/docs/guides/error-handling"
          orientation="right"
        />

        <Heading title="Friday" />
        <RowItem
          title="Edge Event API Beta"
          subtitle="Lower latency from everywhere"
          image="/assets/blog/edge-event-api-beta/featured-image.png"
          label="Beta Release"
          buttonHref="/blog/edge-event-api-beta"
          orientation="left"
        />
        <RowItem
          title="Launch week recap"
          subtitle="The tl;dr of this week's updates"
          image="/assets/launch-week/og.png"
          label="Recap"
          buttonHref="/blog/launch-week-recap"
          orientation="right"
        />
      </Container>

      <Footer disableCta={true} />
    </div>
  );
}

function Heading({ title }) {
  return (
    <h2 className="mt-4 text-center text-xl font-bold uppercase md:text-2xl">
      {title}
    </h2>
  );
}

function RowItem({
  title,
  subtitle,
  label,
  buttonHref,
  docsHref = "",
  image,
  orientation = "left",
  blur = false,
}) {
  return (
    <div
      className={clsx(
        "mx-auto my-16 grid max-w-[440px] grid-cols-1 items-center gap-8 md:mb-28 md:max-w-[1072px] md:grid-cols-2 md:gap-16 md:px-8",
        blur === true && "pointer-events-none blur-lg"
      )}
    >
      <div
        className={clsx(
          "flex",
          orientation === "right" ? "md:order-2" : "justify-end"
        )}
      >
        <a href={`${buttonHref}?ref=launch-week`}>
          <Image
            src={image}
            height={220}
            width={440}
            quality={95}
            alt={`Blog featured image for ${title}`}
            className={clsx(
              "w-full max-w-[440px] rounded-lg	shadow-2xl",
              orientation === "right" && "md:order-2"
            )}
          />
        </a>
      </div>
      <div
        className={clsx(
          "flex flex-col items-start",
          orientation === "right" && "items-end text-right"
        )}
      >
        <span
          className="inline-flex rounded-full border-2 border-transparent px-6 py-1 text-sm font-extrabold text-white"
          style={{
            background: `linear-gradient(#292e23, #292e23) padding-box,
                         linear-gradient(to right, #5EEAD4, #A7F3D0, #FDE68A) border-box`,
          }}
        >
          {label}
        </span>
        <div className="mb-8 mt-4">
          <h3
            className={clsx(
              "mb-2 text-xl font-extrabold leading-snug",
              title.length > 30 ? "md:text-2xl" : "md:text-[32px]"
            )}
            // @ts-ignore
            style={{ textWrap: "pretty" }}
          >
            {title}
          </h3>
          <p className="text-base md:text-lg">{subtitle}</p>
        </div>
        <div className="flex flex-row flex-wrap items-center gap-x-10 gap-y-4">
          <a
            href={`${buttonHref}?ref=launch-week`}
            className="rounded-md bg-gradient-to-r from-[#5EEAD4] to-[#FDE68A] px-3 py-2 font-medium text-slate-950 shadow-sm transition-all hover:from-[#B0F4E9] hover:to-[#FBEDB7]"
          >
            Read blog post
          </a>
          {docsHref && (
            <a
              href={docsHref}
              className="px-3 py-2 text-white hover:text-slate-100"
            >
              Documentation
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
