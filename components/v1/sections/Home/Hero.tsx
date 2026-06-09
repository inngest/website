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

const NPM_URL = "https://www.npmjs.com/package/inngest";

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

// HeroWord / HeroLetters are static wrappers — the per-letter span
// structure stays so a future motion pass can stagger them without
// touching the JSX.

function HeroWord({ children }: { children: string }) {
  return <span className="inline-block">{children}</span>;
}

function HeroLetters({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden="true" className="inline-block">
          {ch}
        </span>
      ))}
    </>
  );
}

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
      className="relative isolate w-full overflow-hidden bg-v1-surfaceBase lg:min-h-screen flex items-center"
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
        className="pointer-events-none relative z-30 mx-auto flex max-w-[1440px] flex-col px-6 pb-12 pt-20 sm:px-10 sm:pt-32 lg:px-[70px] lg:py-[120px]"
      >
        <p
          aria-hidden="true"
          className="text-v1-display-hero uppercase text-v1-frost lg:whitespace-nowrap lg:pr-[100px] lg:text-right lg:leading-[0.8] lg:!text-[clamp(2.5rem,6.7vw,6rem)] lg:tracking-[-0.025em]"
        >
          <span className="block lg:inline">
            <HeroWord>Unbreakable</HeroWord>
          </span>{" "}
          <span className="block lg:inline lg:ml-[0.45em]">
            <span className="inline-block">Agents</span>
          </span>
        </p>

        <p
          aria-hidden="true"
          className="text-v1-display-hero pl-[33%] mt-12 uppercase text-v1-frost lg:mt-[108px] lg:pl-[162px]"
        >
          <span className="block">
            <HeroLetters text="Invisible" />
          </span>
          <span className="block">
            <HeroLetters text="Infra." />
          </span>
        </p>

        <div className="mt-[63px] space-y-[10px] pl-[33%] lg:mt-12 lg:space-y-[20px] lg:pl-[170px]">
          <p className="text-[20px] leading-[1.2] text-v1-frost lg:max-w-[260px]">
            {/* Plain lines — no per-line paint reveal. They ride the
                parent container's `v1-hero-text-in` fade so all three
                enter together, at the same moment as the
                "Unbreakable Agents" / "Invisible Infra." headlines. */}
            <span className="block">No workers.</span>
            <span className="block">No queues.</span>
            <span className="block">No refactoring.</span>
          </p>
          <ButtonLink
            href={NPM_URL}
            variant="accent"
            className="pointer-events-auto"
          >
            NPM&nbsp;[→]
          </ButtonLink>
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
