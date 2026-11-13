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
  minEmployees: 3,
  maxEmployees: 24,
  minRaisedLabel: "$100K",
  maxRaisedLabel: "$5M",
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
  { value: "1-2", label: "1–2" },
  { value: "3-10", label: "3–10" },
  { value: "11-24", label: "11–24" },
  { value: "25+", label: "25 or more" },
];

export const FUNDING_STAGE_OPTIONS: SelectOption[] = [
  { value: "bootstrapped", label: "Bootstrapped / self-funded" },
  { value: "pre-seed", label: "Pre-seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "series-b-plus", label: "Series B or later" },
];

export const TOTAL_RAISED_OPTIONS: SelectOption[] = [
  { value: "under-100k", label: "Under $100K" },
  { value: "100k-1m", label: "$100K–$1M" },
  { value: "1m-5m", label: "$1M–$5M" },
  { value: "5m-plus", label: "$5M or more" },
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
  if (a.headcount === "1-2" || a.headcount === "25+") {
    reasons.push(
      `The program is for teams of ${PROGRAM_RULES.minEmployees} to ${PROGRAM_RULES.maxEmployees} employees.`
    );
  }
  if (
    a.fundingStage === "series-b-plus" ||
    a.totalRaised === "under-100k" ||
    a.totalRaised === "5m-plus"
  ) {
    reasons.push(
      `The program is for bootstrapped companies or those that have raised between ${PROGRAM_RULES.minRaisedLabel} and ${PROGRAM_RULES.maxRaisedLabel} in total.`
    );
  }
  return reasons;
}
