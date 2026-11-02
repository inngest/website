import type { SelectOption } from "@/components/v1/forms";

/**
 * Startup Program eligibility rules. Single source of truth for the
 * page copy, the FAQ, and the form's client-side eligibility check, so a
 * rule change only happens here. Billing/support still review every
 * application by hand; the client-side check just stops clearly
 * ineligible companies from submitting.
 */
export const PROGRAM_RULES = {
  maxCompanyAgeYears: 5,
  maxEmployees: 50,
  maxRaisedLabel: "$30M",
  maxStageLabel: "Series A",
} as const;

const CURRENT_YEAR = new Date().getFullYear();
const OLDEST_ELIGIBLE_YEAR = CURRENT_YEAR - PROGRAM_RULES.maxCompanyAgeYears;

export const FOUNDED_OPTIONS: SelectOption[] = [
  ...Array.from({ length: PROGRAM_RULES.maxCompanyAgeYears + 1 }, (_, i) => {
    const year = String(CURRENT_YEAR - i);
    return { value: year, label: year };
  }),
  { value: "older", label: `${OLDEST_ELIGIBLE_YEAR - 1} or earlier` },
];

export const HEADCOUNT_OPTIONS: SelectOption[] = [
  { value: "1-10", label: "1–10" },
  { value: "11-25", label: "11–25" },
  { value: "26-49", label: "26–49" },
  { value: "50+", label: "50 or more" },
];

export const FUNDING_STAGE_OPTIONS: SelectOption[] = [
  { value: "bootstrapped", label: "Bootstrapped / self-funded" },
  { value: "pre-seed", label: "Pre-seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "series-b-plus", label: "Series B or later" },
];

export const TOTAL_RAISED_OPTIONS: SelectOption[] = [
  { value: "under-1m", label: "Under $1M" },
  { value: "1m-5m", label: "$1M–$5M" },
  { value: "5m-15m", label: "$5M–$15M" },
  { value: "15m-30m", label: "$15M–$30M" },
  { value: "30m-plus", label: "$30M or more" },
];

export interface EligibilityAnswers {
  foundedYear: string;
  headcount: string;
  fundingStage: string;
  totalRaised: string;
}

/** Returns the reasons an applicant is outside the criteria (empty when
 *  they qualify or haven't answered yet). */
export function ineligibilityReasons(a: EligibilityAnswers): string[] {
  const reasons: string[] = [];
  if (a.foundedYear === "older") {
    reasons.push(
      `The program is for companies founded in the last ${PROGRAM_RULES.maxCompanyAgeYears} years.`
    );
  }
  if (a.headcount === "50+") {
    reasons.push(
      `The program is for companies with fewer than ${PROGRAM_RULES.maxEmployees} employees.`
    );
  }
  if (a.fundingStage === "series-b-plus") {
    reasons.push(
      `The program is for bootstrapped companies or those raised through ${PROGRAM_RULES.maxStageLabel}.`
    );
  }
  if (a.fundingStage !== "bootstrapped" && a.totalRaised === "30m-plus") {
    reasons.push(
      `The program is for companies that have raised less than ${PROGRAM_RULES.maxRaisedLabel} in total.`
    );
  }
  return reasons;
}
