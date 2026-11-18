import Link from "next/link";
import PageShell from "@/components/v1/PageShell";
import LiveStage from "@/components/v1/sections/TwelveDays/LiveStage";
import { COLORS, LIVESTREAM } from "@/components/v1/sections/TwelveDays/data";
import {
  buttonClass,
  Chip,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

/**
 * inngest.com/12-days-of-workflows/live — where we send people before
 * and during the finale. A Rube Goldberg countdown until the stream,
 * then the YouTube player (LiveStage). People register on the 12 Days
 * page itself (#register), which "Save your spot" links back to.
 */
export default function TwelveDaysLive() {
  const { live, youtubeId } = LIVESTREAM;

  return (
    <PageShell>
      <div className="overflow-x-clip">
        <section
          aria-labelledby="live-heading"
          className="w-full text-white"
          style={{ backgroundColor: COLORS.ink }}
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

            <LiveStage />

            <div className="flex flex-col gap-3 sm:flex-row">
              {youtubeId ? (
                <a
                  href={`https://www.youtube.com/watch?v=${youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("yellow") + " w-full sm:w-auto"}
                >
                  {live.youtube} <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              <Link
                href={live.register.href}
                className={buttonClass("yellow") + " w-full sm:w-auto"}
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
