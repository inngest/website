import Link from "next/link";
import PageShell from "@/components/v1/PageShell";
import { COLORS, LIVESTREAM } from "@/components/v1/sections/TwelveDays/data";
import {
  buttonClass,
  Chip,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

/**
 * inngest.com/12-days-of-workflows/live — where the finale streams. The
 * YouTube player (privacy-enhanced, youtube-nocookie.com) once
 * `LIVESTREAM.youtubeId` is set; until then a slot that points people to
 * the registration page.
 */
export default function TwelveDaysLive() {
  const { live, youtubeId } = LIVESTREAM;

  return (
    <PageShell>
      <div className="overflow-x-clip">
        <section
          aria-labelledby="live-heading"
          className="w-full text-white"
          style={{ backgroundColor: COLORS.blue }}
        >
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 pb-16 pt-24 sm:px-9 lg:px-8 lg:pb-24 lg:pt-36">
            <div className="flex flex-col gap-5">
              <ul className="flex list-none flex-wrap gap-2 pl-0">
                {live.chips.map((c) => (
                  <li key={c} className="list-none">
                    <Chip tone="dark">{c}</Chip>
                  </li>
                ))}
                <li className="list-none">
                  <Chip>{LIVESTREAM.when}</Chip>
                </li>
              </ul>
              <h1
                id="live-heading"
                className={`${POSTER_TITLE} !text-[clamp(36px,6vw,80px)]`}
              >
                {live.title}
              </h1>
            </div>

            <div className="overflow-hidden rounded-xl border-[3px] border-[#010101] bg-[#010101] shadow-[8px_8px_0_#010101]">
              {youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
                  title={live.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="aspect-video w-full"
                />
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-5 p-6 text-center">
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-20 items-center justify-center rounded-[16px] bg-[#FF0000]"
                  >
                    <span className="ml-1 block h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-white" />
                  </span>
                  <p className="max-w-[460px] font-v1Label text-[16px] leading-[1.5]">
                    {live.soon}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {youtubeId ? (
                <a
                  href={`https://www.youtube.com/watch?v=${youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("lime") + " w-full sm:w-auto"}
                >
                  {live.youtube} <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              <Link
                href={live.register.href}
                className={buttonClass("lime") + " w-full sm:w-auto"}
              >
                {live.register.label}
              </Link>
              <Link
                href={live.back.href}
                className={buttonClass("ghost") + " w-full sm:w-auto"}
              >
                {live.back.label}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
