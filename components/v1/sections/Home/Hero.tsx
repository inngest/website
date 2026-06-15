"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ButtonLink from "@/components/v1/ButtonLink";
import HeroAmbientDots from "@/components/v1/sections/Home/HeroAmbientDots";
import HeroCodeStatic from "@/components/v1/sections/Home/HeroCodeStatic";

const HeroCodeCanvas = dynamic(
  () => import("@/components/v1/sections/Home/HeroCodeCanvas"),
  { ssr: false },
);

// Consumed by both the desktop HeroCodeScene (canvas morph) and the
// mobile HeroCodeStatic (accordion). Lines starting with `■` are
// section bullets the canvas pulses orange / the static layout uses
// as labels. Pre-broken to ~58 chars so the canvas formation
// auto-fits without shrinking.
const HERO_CODE = [
  "■ step.run()",
  "",
  "    export default inngest.createFunction(",
  "      {",
  '        id: "import-product-images",',
  '        triggers: { event: "shop/product.imported" },',
  "      },",
  "      async ({ event, step }) => {",
  '        const uploadedImageURLs = await step.run("copy-',
  '          images-to-s3", async () => {',
  "          return copyAllImagesToS3(event.data.imageURLs);",
  "        });",
  "      }",
  "    );|",
  "",
  "■ step.waitForEvent()",
  "",
  "    const confirmation = await step.waitForEvent(",
  '      "await-confirmation", {',
  '        event: "user/confirmed",',
  '        timeout: "1h",',
  "      },",
  "    );|",
  "",
  "■ step.invoke()",
  "",
  '    const result = await step.invoke("call-another-fn", {',
  "      function: otherFunction,",
  "      data: { userId: event.data.userId },",
  "    });|",
].join("\n");

export default function Hero() {
  const [codeReady, setCodeReady] = useState(false);
  useEffect(() => {
    // Boot the HeroCodeScene on the first idle tick so the dots
    // paint in BEFORE the title text fades in. Falls back to a
    // synchronous mount in browsers without `requestIdleCallback`.
    let cancelled = false;
    const idle = (
      window as Window & {
        requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      }
    ).requestIdleCallback;
    if (idle) {
      idle(() => !cancelled && setCodeReady(true), { timeout: 200 });
    } else {
      setCodeReady(true);
    }
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <section
      aria-labelledby="hero-headline"
      // Hero leans darker than the body bg (`v1-canvasBase` is
      // 28 28 28) so the opening frame reads with more depth. The
      // gradient bg images cover this; the colour is the fallback
      // before they load.
      className="relative isolate w-full overflow-hidden bg-v1-surfaceBase lg:min-h-screen flex items-center lg:items-start"
    >
      {/* Designer-authored hero gradient. Two assets
          via Tailwind responsive background-image utilities: a
          portrait gradient below lg, the wide desktop gradient at
          lg+. Sits above the section's near-black fallback; z-0
          keeps it behind the particle layer + content stack. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-[url(/assets/v1/hero/.compressed/inngest-hero-mobile.avif)] lg:bg-[url(/assets/v1/hero/.compressed/inngest-hero.avif?v=3)]"
      />
      {codeReady && (
        <HeroCodeCanvas
          className="pointer-events-none absolute inset-0 z-v1-backdrop hidden h-full w-full lg:block"
          code={HERO_CODE}
        />
      )}
      {/* Mobile: lightweight CSS-only ambient dots in place of the
          canvas scene (which is too heavy for phones and isn't shown
          there). Hidden on lg+ where the real canvas takes over. */}
      <HeroAmbientDots className="lg:hidden" />

      <h1 id="hero-headline" className="sr-only">
        Unbreakable Agents. Invisible Infra.
      </h1>

      <div
        // `pointer-events-none` so this content layer (z-30) doesn't
        // swallow clicks meant for the canvas's step-title buttons,
        // which sit BELOW it at `z-v1-backdrop`. Interactive children
        // (the NPM button; the mobile accordion rows in HeroCodeStatic)
        // re-enable hits with `pointer-events-auto`. Mirrors HeroTest.
        className="pointer-events-none relative z-30 flex w-full flex-col px-6 pb-12 pt-20 sm:px-10 sm:pt-32 lg:pl-[34px] lg:pr-[70px] lg:pt-[calc(40vh_-_1.64*min(8vw,16vh)_+_27px)] lg:pb-[40px]"
      >
        {/* Stacked two-tone display: UNBREAKABLE / AGENTS. in solid
            frost, INVISIBLE / INFRA. as an outlined frost stroke. Both
            left-aligned to the logo mark via the -0.06em optical cheat. */}
        <p
          aria-hidden="true"
          className="text-v1-display-hero uppercase text-v1-frost lg:pr-[100px] lg:-ml-[0.06em] text-left leading-[0.82] !text-[min(8vw,16vh)] tracking-[-0.025em]"
        >
          <span className="block">Unbreakable</span>
          <span className="block">Agents.</span>
        </p>

        <p
          aria-hidden="true"
          className="text-v1-display-hero mt-6 uppercase text-v1-frost lg:mt-[7vh] lg:pr-[100px] lg:-ml-[0.06em] text-left leading-[0.82] !text-[min(8vw,16vh)] tracking-[-0.025em]"
        >
          <span className="block text-transparent [-webkit-text-stroke:0.75px_rgb(255,255,255)] md:[-webkit-text-stroke:1px_rgb(255,255,255)] lg:[-webkit-text-stroke:2px_rgb(255,255,255)]">Invisible</span>
          <span className="block text-transparent [-webkit-text-stroke:0.75px_rgb(255,255,255)] md:[-webkit-text-stroke:1px_rgb(255,255,255)] lg:[-webkit-text-stroke:2px_rgb(255,255,255)]">Infra.</span>
        </p>

        <div className="mt-[48px] space-y-[36px] lg:mt-[6vh] lg:space-y-[42px] lg:pl-0">
          {/* Mono eyebrow kicker — uppercase WhyteMono, single row at
              every breakpoint; fluid size keeps it on one line. */}
          <p className="whitespace-nowrap font-v1Label uppercase tracking-[0.08em] text-[clamp(0.8125rem,1.4vw,1.25rem)] leading-[1.2] text-v1-frost">
            No workers. No queues. No refactoring.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row pointer-events-auto">
            <ButtonLink
              href={`${process.env.NEXT_PUBLIC_SIGNUP_URL ?? "/sign-up"}?ref=homepage-hero`}
              variant="accent"
              className="pointer-events-auto"
            >
              Start Building
            </ButtonLink>
            <ButtonLink
              href="/contact?ref=homepage-hero"
              variant="secondary"
              className="pointer-events-auto"
            >
              Book a demo
            </ButtonLink>
          </div>
        </div>

        {/* Mobile: the desktop canvas-morph isn't shown on phones, so
            the code lives here as plain `<pre><code>`. Real semantics,
            joins the parent's `v1-hero-text-in` fade. */}
        <HeroCodeStatic
          className="mt-11 lg:hidden"
          code={HERO_CODE}
        />
      </div>
    </section>
  );
}
