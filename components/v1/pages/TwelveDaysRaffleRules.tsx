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
/**
 * Draft terms. US location and a matching Inngest account are the
 * campaign's requirements; the rest are common sweepstakes terms for
 * legal to confirm or replace.
 */
const TERMS = [
  {
    title: "Located in the US",
    body: "You must be located in the United States when you enter and when the prize is awarded. Prizes ship only to US addresses.",
  },
  {
    title: "A valid Inngest account",
    body: "You must have a valid Inngest account, free or paid, registered to the same email address you enter with. If there's no account under your entry email when the winner is drawn, that entry can't win. A free account qualifies, so no purchase is necessary.",
  },
  {
    title: "One entry per person per day",
    body: "Enter once per day, December 7–18, while that day's door is open (each day's raffle closes at midnight Eastern when the next door opens). Extra entries for the same day don't count.",
  },
  {
    title: "How winners are picked",
    body: "Each day's winner is drawn at random from that day's entries after that day's raffle closes.",
  },
  {
    title: "Contacting winners",
    body: "We'll email winners at the address they entered with. If a winner doesn't reply within 7 days, or doesn't meet these terms, we'll draw another winner for that day.",
  },
  {
    title: "Prizes",
    body: "Prizes can't be transferred or exchanged for cash. We may substitute a prize of equal or greater value if one isn't available.",
  },
  {
    title: "Who can't enter",
    body: "Inngest employees and their immediate families can't enter.",
  },
];

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
            Each day&rsquo;s prize is drawn from that day&rsquo;s entries.
          </p>
          <h2 className="font-sans text-[24px] font-black">
            Terms and conditions
          </h2>
          <ol className="flex list-decimal flex-col gap-3 pl-6 text-[16px] leading-[26px]">
            {TERMS.map((t) => (
              <li key={t.title}>
                <strong>{t.title}.</strong> {t.body}
              </li>
            ))}
          </ol>
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
