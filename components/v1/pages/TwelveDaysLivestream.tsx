"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import PageShell from "@/components/v1/PageShell";
import { clearHeroPanel, setHeroPanel } from "@/utils/v1/heroNav";
import LivestreamForm from "@/components/v1/sections/TwelveDays/LivestreamForm";
import {
  COLORS,
  FINALE,
  LIVESTREAM,
} from "@/components/v1/sections/TwelveDays/data";
import {
  Chip,
  POSTER_EYEBROW,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

/**
 * inngest.com/12-days-of-workflows/livestream — register for the finale
 * on CodeTV: the pitch and the date on the left, name and email on the
 * right. The stream itself plays at /12-days-of-workflows/live.
 */
export default function TwelveDaysLivestream() {
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
          aria-labelledby="livestream-heading"
          className="w-full"
          style={{ backgroundColor: COLORS.salmon, color: COLORS.ink }}
        >
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-12 px-6 pb-16 pt-24 sm:px-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:px-8 lg:pb-24 lg:pt-36">
            <div className="flex flex-col gap-6">
              <ul className="flex list-none flex-wrap gap-2 pl-0">
                {LIVESTREAM.chips.map((c, i) => (
                  <li key={c} className="list-none">
                    <Chip tone={i === 0 ? "dark" : "light"}>{c}</Chip>
                  </li>
                ))}
              </ul>
              <h1 id="livestream-heading" className={POSTER_TITLE}>
                <span className="block text-white">{LIVESTREAM.title[0]}</span>
                <span className="block">{LIVESTREAM.title[1]}</span>
              </h1>
              <p className="max-w-[620px] text-[18px] leading-[28px] sm:text-[20px] sm:leading-[30px]">
                {LIVESTREAM.body}
              </p>
              <p className="font-v1Label text-[15px]">{LIVESTREAM.when}</p>
              <div className="mt-4 hidden max-w-[360px] lg:block">
                <Image
                  src={FINALE.image}
                  alt={FINALE.imageAlt}
                  width={1300}
                  height={1405}
                  priority
                  sizes="360px"
                  className="h-auto w-full"
                />
              </div>
            </div>

            <div id="register" className="flex scroll-mt-24 flex-col gap-5">
              <div className="flex flex-col gap-2">
                <p className={POSTER_EYEBROW}>{LIVESTREAM.chips[0]}</p>
                <h2 className="font-sans text-[clamp(36px,4.4vw,56px)] font-black leading-[0.95] tracking-[-0.02em] text-white">
                  {LIVESTREAM.form.title}
                </h2>
                <p className="text-[16px] leading-[24px]">
                  {LIVESTREAM.form.intro}
                </p>
              </div>
              <LivestreamForm />
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
