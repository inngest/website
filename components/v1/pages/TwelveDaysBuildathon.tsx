"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/v1/PageShell";
import { clearHeroPanel, setHeroPanel } from "@/utils/v1/heroNav";
import BuildathonForm from "@/components/v1/sections/TwelveDays/BuildathonForm";
import {
  BUILDATHON,
  COLORS,
  DAYS,
} from "@/components/v1/sections/TwelveDays/data";
import {
  buttonClass,
  Chip,
  POSTER_EYEBROW,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

/**
 * inngest.com/12-days-of-workflows/build-a-thon — the "build your weird
 * workflow" challenge that feeds the finale livestream.
 *
 * Salmon header with the brief and the rat-wheel contraption, then the rules, the twelve primitives
 * an entry has to use (read from the calendar's DAYS, so the list stays
 * in step with the doors) and the entry form.
 */
export default function TwelveDaysBuildathon() {
  // The fixed header sits on salmon here too (see the 12 Days hero).
  const heroToken = useRef<object>({});
  useEffect(() => {
    const token = heroToken.current;
    setHeroPanel("salmon", token);
    return () => clearHeroPanel(token);
  }, []);

  return (
    <PageShell>
      <div className="overflow-x-clip">
        <section
          aria-labelledby="buildathon-heading"
          className="w-full"
          style={{ backgroundColor: COLORS.salmon, color: COLORS.ink }}
        >
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-x-10 px-6 pb-16 pt-24 sm:px-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,30%)] lg:px-8 lg:pb-0 lg:pt-36">
            <div className="flex flex-col gap-6 lg:pb-20">
              <ul className="flex list-none flex-wrap gap-2 pl-0">
                {BUILDATHON.chips.map((c, i) => (
                  <li key={c} className="list-none">
                    <Chip tone={i === 0 ? "dark" : "light"}>{c}</Chip>
                  </li>
                ))}
              </ul>
              <h1 id="buildathon-heading" className={POSTER_TITLE}>
                <span className="block text-white">{BUILDATHON.title[0]}</span>
                <span className="block">{BUILDATHON.title[1]}</span>
              </h1>
              <p className="max-w-[680px] text-[18px] leading-[28px] sm:text-[20px] sm:leading-[30px]">
                {BUILDATHON.body}
              </p>
              <p className="font-v1Label text-[15px]">{BUILDATHON.when}</p>
              <div>
                <a
                  href={BUILDATHON.cta.href}
                  className={buttonClass("ink") + " w-full sm:w-auto"}
                >
                  {BUILDATHON.cta.label}
                </a>
              </div>
            </div>

            {/* The contraption: rat on a wheel, a hand, a mug, a mouth. */}
            <div className="relative mx-auto mt-12 w-full max-w-[320px] self-end lg:mt-0 lg:max-w-none">
              <Image
                src="/assets/v1/12-days/contraption.webp"
                alt="A rat in a green vest running on a wheel, which tips a hand to pour coffee from a green mug into a wide-open mouth."
                width={760}
                height={1499}
                priority
                sizes="(max-width: 1024px) 320px, 30vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        <section
          aria-label={BUILDATHON.formTitle}
          className="w-full bg-white text-[#010101]"
        >
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-6 py-16 sm:px-9 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:px-8 lg:py-24">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <h2 className={POSTER_EYEBROW}>{BUILDATHON.rulesTitle}</h2>
                <ol className="flex flex-col gap-3 pl-0">
                  {BUILDATHON.rules.map((r, i) => (
                    <li
                      key={r}
                      className="flex list-none gap-3 text-[18px] leading-[28px]"
                    >
                      <span className="font-v1Label text-[#F55C50]">
                        {i + 1}.
                      </span>
                      {r}
                    </li>
                  ))}
                </ol>
                <p className="pl-[34px] text-[14px] italic leading-[22px] text-[#010101]/70">
                  {BUILDATHON.rulesFootnote}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className={POSTER_EYEBROW}>{BUILDATHON.primitivesTitle}</h2>
                <ol className="grid grid-cols-1 gap-2 pl-0 sm:grid-cols-2">
                  {DAYS.map((d) => (
                    <li
                      key={d.day}
                      className="flex list-none items-center gap-3 rounded-md border-2 border-[#010101] px-3 py-2"
                    >
                      <span className="shrink-0 whitespace-nowrap font-v1Label text-[12px] text-[#010101]/60">
                        Day {d.day}
                      </span>
                      <Link
                        href={d.docs.href}
                        className="text-[16px] underline decoration-[#F55C50] decoration-2 underline-offset-4 hover:decoration-[#010101]"
                      >
                        {d.primitive}
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className={POSTER_EYEBROW}>{BUILDATHON.prizesTitle}</h2>
                <ul className="flex flex-col gap-2 pl-0">
                  {BUILDATHON.prizes.map((p) => (
                    <li
                      key={p.place}
                      className="list-none text-[18px] leading-[28px]"
                    >
                      <span className="font-black">{p.place}:</span> {p.prize}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={BUILDATHON.startCta.href}
                  className={buttonClass("ink") + " w-full sm:w-auto"}
                >
                  {BUILDATHON.startCta.label}
                </Link>
                <Link
                  href={BUILDATHON.back.href}
                  className={buttonClass("outline") + " w-full sm:w-auto"}
                >
                  {BUILDATHON.back.label}
                </Link>
              </div>
            </div>

            <div id="submit" className="flex scroll-mt-24 flex-col gap-5">
              <h2 className={POSTER_EYEBROW}>{BUILDATHON.formTitle}</h2>
              <BuildathonForm />
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
