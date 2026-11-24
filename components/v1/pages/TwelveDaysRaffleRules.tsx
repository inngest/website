import type { ReactNode } from "react";
import Link from "next/link";
import PageShell from "@/components/v1/PageShell";
import LightPageHeader from "@/components/v1/sections/TwelveDays/LightPageHeader";
import {
  COLORS,
  DAILY_PRIZES,
  REF,
  UNLOCK_DATES,
  YEAR,
} from "@/components/v1/sections/TwelveDays/data";
import {
  buttonClass,
  POSTER_TITLE,
} from "@/components/v1/sections/TwelveDays/poster";

/**
 * /12-days-of-workflows/raffle-rules: the official rules for the 12 Days
 * of Workflows daily raffle (a sweepstakes: free, random draw).
 *
 * Written to the usual US sweepstakes checklist: no purchase necessary,
 * sponsor, eligibility, entry periods, how to enter, limits, odds, the
 * draw, prizes with values, taxes, notification, publicity, conditions,
 * releases, disputes, privacy and the winners list. Have legal look it
 * over before December 7; they own the final wording.
 *
 * Keep the prize total under $5,000: above that, New York and Florida
 * require registering and bonding the sweepstakes.
 */

const SPONSOR = "Inngest Inc.";
const SPONSOR_ADDRESS = "600 California St, Suite 1200, San Francisco, CA";
const CONTACT = "hello@inngest.com";
const FIRST = UNLOCK_DATES[0];
const LAST = UNLOCK_DATES[UNLOCK_DATES.length - 1];
const TOTAL_ARV = DAILY_PRIZES.reduce((sum, p) => sum + p.value, 0);
const WINNERS_LIST_BY = `January 31, ${YEAR + 1}`;

/** The short version, up top, so the essentials can't be missed. */
const SUMMARY = [
  "Free to enter. No purchase necessary.",
  "Open to legal residents of the 50 US states and DC who are 18 or older.",
  "You need an Inngest account (free is fine) under the same email you enter with.",
  `One entry per person per day, December ${FIRST}–${LAST}, ${YEAR}.`,
  "One winner is drawn at random for each day's prize.",
  "Winners are emailed and have 7 days to reply.",
  "Limit one prize per person for the whole raffle.",
];

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="underline underline-offset-4">
    {children}
  </Link>
);

const RULES: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "sponsor",
    title: "Sponsor",
    body: (
      <p>
        The 12 Days of Workflows Daily Raffle (the &ldquo;Raffle&rdquo;) is
        sponsored by {SPONSOR}, {SPONSOR_ADDRESS} (&ldquo;Sponsor&rdquo;).
        Questions: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. The Raffle is
        not sponsored, endorsed or administered by, or associated with, Garmin,
        Bambu Lab, Sony, Ember, Amazon, Nintendo, LEGO, Breville, Meta or any
        other prize manufacturer. CodeTV, Sponsor&rsquo;s partner for the 12
        Days of Workflows livestream, does not administer the Raffle.
      </p>
    ),
  },
  {
    id: "eligibility",
    title: "Who can enter",
    body: (
      <>
        <p>
          The Raffle is open only to individuals who, at the time of entry and
          when the prize is awarded:
        </p>
        <ul className="list-disc pl-6">
          <li>
            are legal residents of the 50 United States or the District of
            Columbia and are physically located there;
          </li>
          <li>
            are at least 18 years old and have reached the age of majority in
            their state of residence (19 in Alabama and Nebraska, 21 in
            Mississippi); and
          </li>
          <li>
            have a valid Inngest account, free or paid, registered to the same
            email address used to enter. A free account is available at{" "}
            <A href={`/sign-up?ref=${REF}-raffle-rules`}>inngest.com/sign-up</A>{" "}
            and costs nothing.
          </li>
        </ul>
        <p>
          The Raffle is void outside the United States and wherever prohibited
          or restricted by law. Entries on behalf of a business or other entity
          are not accepted; the individual entrant is the potential winner.
        </p>
      </>
    ),
  },
  {
    id: "entry-period",
    title: "When to enter",
    body: (
      <>
        <p>
          The Raffle has twelve daily drawing periods (each a &ldquo;Drawing
          Period&rdquo;), one for each calendar date from December {FIRST} to
          December {LAST}, {YEAR}. Each Drawing Period starts at 12:00:00 a.m.
          Eastern Time (ET) on its date and ends at 11:59:59 p.m. ET that day. A
          form opened before a Drawing Period ends and submitted within ten (10)
          minutes after it ends counts for that Drawing Period.
        </p>
        <p>
          Sponsor&rsquo;s servers are the official clock for the Raffle. Entries
          received outside a Drawing Period are void.
        </p>
      </>
    ),
  },
  {
    id: "how-to-enter",
    title: "How to enter",
    body: (
      <>
        <p>
          During a Drawing Period, visit{" "}
          <A href={`/12-days-of-workflows?ref=${REF}-raffle-rules#calendar`}>
            inngest.com/12-days-of-workflows
          </A>{" "}
          and submit the entry form with your name and email address. Entering
          is free. No purchase, payment or paid plan is required, and none will
          increase your chances of winning.
        </p>
        <p>
          Entering also signs you up for the 12 Days of Workflows emails (one
          email each day a new lesson opens). You can unsubscribe at any time
          using the link in any email; unsubscribing does not affect entries you
          have already made.
        </p>
      </>
    ),
  },
  {
    id: "limits",
    title: "Entry limits",
    body: (
      <p>
        Limit one (1) entry per person per Drawing Period, for a maximum of
        twelve (12) entries per person across the Raffle. Each person may use
        only one email address. Additional entries in the same Drawing Period
        are disregarded. Entries made using multiple email addresses or
        identities, or by script, bot, macro or any other automated means, are
        void, and anyone found doing so may be disqualified from the whole
        Raffle. Entries become Sponsor&rsquo;s property and will not be
        acknowledged or returned.
      </p>
    ),
  },
  {
    id: "drawing",
    title: "How winners are picked, and the odds",
    body: (
      <p>
        Within three (3) business days after each Drawing Period ends, Sponsor
        will select one (1) potential winner at random from all eligible entries
        received in that Drawing Period. The odds of winning depend on the
        number of eligible entries received in that Drawing Period.
        Sponsor&rsquo;s decisions on all matters relating to the Raffle are
        final and binding.
      </p>
    ),
  },
  {
    id: "prizes",
    title: "Prizes",
    body: (
      <>
        <p>
          There are twelve (12) prizes, one per Drawing Period, listed below
          with their approximate retail value (&ldquo;ARV&rdquo;) in US dollars.
          Total ARV of all prizes: ${TOTAL_ARV.toLocaleString("en-US")}. Actual
          value may vary with market price; any difference between the ARV and
          actual value will not be awarded.
        </p>
        <table className="w-full border-collapse text-left text-[16px]">
          <thead>
            <tr className="border-b-2 border-[#020202] font-v1Label text-[13px]">
              <th className="py-2 pr-4">Drawing Period</th>
              <th className="py-2 pr-4">Prize</th>
              <th className="py-2 text-right">ARV</th>
            </tr>
          </thead>
          <tbody>
            {DAILY_PRIZES.map((p) => (
              <tr key={p.day} className="border-b border-[#020202]/20">
                <td className="py-2 pr-4 font-v1Label text-[14px]">
                  Dec {UNLOCK_DATES[p.day - 1]}
                </td>
                <td className="py-2 pr-4">{p.prize}</td>
                <td className="py-2 text-right">${p.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <strong>Limit one (1) prize per person</strong> for the entire Raffle.
          If a person is drawn for a second prize, Sponsor will draw another
          eligible entry from that Drawing Period.
        </p>
        <p>
          Prizes are awarded &ldquo;as is&rdquo; and carry only the
          manufacturer&rsquo;s warranty, if any. Prizes cannot be transferred,
          assigned or redeemed for cash. Sponsor may substitute a prize of equal
          or greater value if a listed prize becomes unavailable. Prizes ship
          only to addresses in the United States, within about six (6) weeks
          after the winner is confirmed. Any subscription included in a prize is
          subject to the provider&rsquo;s own terms.
        </p>
      </>
    ),
  },
  {
    id: "taxes",
    title: "Taxes",
    body: (
      <p>
        Winners are solely responsible for all federal, state and local taxes on
        their prize and for any costs not listed as part of the prize. Sponsor
        may require a completed IRS Form W-9 (including a taxpayer
        identification number) before awarding a prize, and will issue an IRS
        Form 1099 where required by law.
      </p>
    ),
  },
  {
    id: "notification",
    title: "Winner notification and verification",
    body: (
      <>
        <p>
          Potential winners will be notified by email at the address used to
          enter, within three (3) business days after their drawing. To claim a
          prize, a potential winner must reply within seven (7) days of the
          notification email and, if requested, sign and return a declaration of
          eligibility, liability release and (where lawful) publicity release
          within seven (7) days of receiving it.
        </p>
        <p>
          A potential winner forfeits the prize, and Sponsor may draw an
          alternate from the same Drawing Period, if they: do not reply or
          return documents in time; cannot be reached or the notification is
          undeliverable; do not have a valid Inngest account under their entry
          email; or are otherwise ineligible or not in compliance with these
          rules. A person is not a winner until Sponsor has verified their
          eligibility.
        </p>
      </>
    ),
  },
  {
    id: "publicity",
    title: "Publicity",
    body: (
      <p>
        Except where prohibited by law, accepting a prize is permission for
        Sponsor to use the winner&rsquo;s first name, last initial, city and
        state, and the fact that they won, in announcements and promotional
        material about the Raffle, in any media, without further compensation or
        notice.
      </p>
    ),
  },
  {
    id: "conditions",
    title: "General conditions",
    body: (
      <>
        <p>
          Sponsor may disqualify anyone it finds tampering with the entry
          process or the operation of the Raffle, acting fraudulently or in
          violation of these rules, or acting in an unsportsmanlike or
          disruptive way.
        </p>
        <p>
          If the Raffle cannot run as planned because of a computer virus, bug,
          tampering, unauthorized intervention, fraud, technical failure or any
          other cause beyond Sponsor&rsquo;s control that affects its
          administration, security, fairness or integrity, Sponsor may cancel,
          end, modify or suspend the Raffle or any Drawing Period and, if it
          does, award prizes by random drawing from eligible entries received
          before the action was taken.
        </p>
        <p>
          Sponsor is not responsible for lost, late, incomplete, misdirected or
          unreadable entries, or for any technical, network, hardware, software
          or human error in entering, processing or drawing entries.
        </p>
        <p>
          <strong>Caution:</strong> any attempt to deliberately damage the
          website or undermine the legitimate operation of the Raffle may
          violate criminal and civil laws. Sponsor reserves the right to seek
          damages from anyone who does so, to the fullest extent of the law.
        </p>
      </>
    ),
  },
  {
    id: "release",
    title: "Release and limitation of liability",
    body: (
      <p>
        By entering, you agree to release and hold harmless Sponsor, its parent,
        subsidiaries and affiliates, its partners and prize suppliers, and each
        of their officers, directors, employees and agents (the &ldquo;Released
        Parties&rdquo;) from any and all claims, losses or damages arising out
        of your participation in the Raffle or the acceptance, possession, use
        or misuse of any prize, including claims for personal injury, death or
        property damage. To the fullest extent permitted by law, the Released
        Parties make no warranties, express or implied, about any prize.
      </p>
    ),
  },
  {
    id: "disputes",
    title: "Disputes",
    body: (
      <p>
        These rules and the Raffle are governed by the laws of the State of
        California, without regard to its conflict of law rules. Any dispute
        arising out of or relating to the Raffle must be resolved individually,
        without resort to any class action, and exclusively in the state or
        federal courts located in San Francisco, California. Any claims,
        judgments or awards are limited to actual out-of-pocket costs of
        entering (if any), and in no event include attorneys&rsquo; fees or
        punitive, incidental or consequential damages.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    body: (
      <p>
        Information you provide to enter is collected by Sponsor and used to run
        the Raffle, contact winners and send the 12 Days of Workflows emails, as
        described in Sponsor&rsquo;s{" "}
        <A href={`/privacy?ref=${REF}-raffle-rules`}>Privacy Policy</A>.
      </p>
    ),
  },
  {
    id: "winners",
    title: "Winners list and these rules",
    body: (
      <>
        <p>
          For the names of the winners, email{" "}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a> with the subject &ldquo;12
          Days raffle winners&rdquo; by {WINNERS_LIST_BY}.
        </p>
        <p>
          By entering, you agree to these Official Rules. If any part of these
          rules is found invalid, the rest stays in effect. The daily raffle is
          separate from the 12 Days of Workflows build-a-thon, which is a
          skill-based contest with its own terms.
        </p>
      </>
    ),
  },
];

export default function TwelveDaysRaffleRules() {
  return (
    <PageShell>
      <LightPageHeader />
      <section
        aria-labelledby="raffle-rules-heading"
        className="w-full"
        style={{ backgroundColor: COLORS.white, color: COLORS.ink }}
      >
        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-8 px-6 pb-16 pt-24 sm:px-9 lg:pb-24 lg:pt-36">
          <div className="flex flex-col gap-3">
            <h1
              id="raffle-rules-heading"
              className={`${POSTER_TITLE} !text-[clamp(36px,6vw,72px)]`}
            >
              Official raffle rules
            </h1>
            <p className="font-v1Label text-[14px]">
              12 Days of Workflows Daily Raffle · December {FIRST}–{LAST},{" "}
              {YEAR}
            </p>
          </div>

          {/* The legally required headline, impossible to miss. */}
          <p className="rounded-xl border-[3px] border-[#020202] bg-[#F7DA10] p-5 font-sans text-[18px] font-black uppercase leading-[1.35] shadow-[6px_6px_0_#020202]">
            No purchase necessary to enter or win. A purchase or payment of any
            kind will not increase your chances of winning. Open only to legal
            residents of the 50 United States and DC who are 18 or older. Void
            where prohibited.
          </p>

          <div className="flex flex-col gap-3 rounded-xl border-2 border-[#020202] p-5">
            <h2 className="font-sans text-[22px] font-black">
              The short version
            </h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-6 text-[16px] leading-[24px]">
              {SUMMARY.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="text-[14px] leading-[22px] text-[#020202]/70">
              This summary is for convenience. The Official Rules below are what
              count.
            </p>
          </div>

          <nav aria-label="Rules sections" className="font-v1Label text-[13px]">
            <ol className="flex flex-wrap gap-x-4 gap-y-1 pl-0">
              {RULES.map((r, i) => (
                <li key={r.id} className="list-none">
                  <a
                    href={`#${r.id}`}
                    className="underline underline-offset-4 hover:no-underline"
                  >
                    {i + 1}. {r.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <ol className="flex flex-col gap-8 pl-0">
            {RULES.map((r, i) => (
              <li
                key={r.id}
                id={r.id}
                className="flex scroll-mt-24 list-none flex-col gap-3 text-[16px] leading-[26px] [&_a]:underline [&_a]:underline-offset-4"
              >
                <h2 className="font-sans text-[22px] font-black leading-[1.2]">
                  {i + 1}. {r.title}
                </h2>
                {r.body}
              </li>
            ))}
          </ol>

          <p className="font-v1Label text-[13px] text-[#020202]/70">
            Sponsor: {SPONSOR}, {SPONSOR_ADDRESS}.
          </p>

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
