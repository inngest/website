import Link from "next/link";
import PageShell from "@/components/v1/PageShell";
import {
  COLORS,
  DAILY_PRIZES,
  REF,
  UNLOCK_DATES,
} from "@/components/v1/sections/TwelveDays/data";
import {
  buttonClass,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

/**
 * /12-days-of-workflows/raffle-rules
 *
 * TODO before launch: replace the placeholder with the official rules
 * from legal (sponsor, eligibility, how to enter without purchase,
 * entry period, odds, prizes and their value, the draw, how winners are
 * notified, void where prohibited).
 */
export default function TwelveDaysRaffleRules() {
  return (
    <PageShell>
      <section
        aria-labelledby="raffle-rules-heading"
        className="w-full"
        style={{ backgroundColor: COLORS.cream, color: COLORS.ink }}
      >
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-6 px-6 pb-16 pt-24 sm:px-9 lg:pb-24 lg:pt-36">
          <h1
            id="raffle-rules-heading"
            className={`${POSTER_TITLE} !text-[clamp(36px,6vw,72px)]`}
          >
            Raffle rules
          </h1>
          <p className="rounded-md border-2 border-dashed border-[#010101] bg-white p-4 font-v1Label text-[14px]">
            Draft placeholder. The official rules for the 12 Days of Workflows
            daily raffle will be published here before the raffle opens.
          </p>
          <p className="text-[18px] leading-[28px]">
            No purchase necessary. One entry per person per day, December 7–18.
            Each day&rsquo;s prize is drawn from that day&rsquo;s entries, and
            every entry also counts toward the grand prize, drawn live on CodeTV
            on December 29.
          </p>
          <h2 className="font-sans text-[24px] font-black">
            Daily prizes and approximate retail value
          </h2>
          <table className="w-full border-collapse text-left text-[16px]">
            <thead>
              <tr className="border-b-2 border-[#010101] font-v1Label text-[13px]">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Prize</th>
                <th className="py-2 text-right">ARV (USD)</th>
              </tr>
            </thead>
            <tbody>
              {DAILY_PRIZES.map((p) => (
                <tr key={p.day} className="border-b border-[#010101]/20">
                  <td className="py-2 pr-4 font-v1Label text-[14px]">
                    Dec {UNLOCK_DATES[p.day - 1]}
                  </td>
                  <td className="py-2 pr-4">{p.prize}</td>
                  <td className="py-2 text-right">${p.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link
            href={`/12-days-of-workflows?ref=${REF}-raffle-rules#raffle`}
            className={buttonClass("ink") + " self-start"}
          >
            Back to 12 Days
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
