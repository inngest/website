import {
  FEATURES,
  PLANS,
  type FeatureCell,
} from "@/components/v1/sections/Pricing/plans";
import {
  PROGRAM_OFFER,
  PROGRAM_RULES,
} from "@/components/v1/sections/Startups/program";

/**
 * Pricing and program content for the LLM-facing files (/llms.txt and
 * /llm-context.md). Built from the same data as the /pricing page so the
 * numbers can't drift from what customers see.
 */

const HOST = "https://www.inngest.com";

function cellText(cell: FeatureCell | undefined): string {
  if (cell === undefined) return "n/a";
  if (cell === false) return "No";
  if (cell === true) return "Yes";
  if (typeof cell === "string") return cell;
  return cell.description ? `${cell.value} (${cell.description})` : cell.value;
}

const BASE_PRICE = FEATURES.find((f) => f.name === "Base price");

/** "Free ($0), Pro ($99 /mo), …" from the comparison table's base price row. */
function planPriceList(): string {
  return PLANS.map(
    (plan) => `${plan.name} (${cellText(BASE_PRICE?.plans[plan.name])})`
  ).join(", ");
}

/** " Free plan: no credit card required." from the Free card's caption. */
function freePlanNote(): string {
  const free = PLANS[0];
  return free?.priceCaption
    ? ` ${free.name} plan: ${free.priceCaption.toLowerCase()}.`
    : "";
}

/** Eligibility in one sentence, from the same rules the form checks. */
function eligibility(): string {
  const r = PROGRAM_RULES;
  return `For new customers founded in the last ${r.maxCompanyAgeYears} years with ${r.minEmployees} to ${r.maxEmployees} employees that are bootstrapped or have raised between ${r.minRaisedLabel} and ${r.maxRaisedLabel}.`;
}

/** "## Pricing & programs" section for /llms.txt. */
export function llmsPricingSection(): string {
  return `## Pricing & programs

- [Pricing](${HOST}/pricing): Plans and included limits. ${planPriceList()}.${freePlanNote()}
- [Startup Program](${HOST}/startups): ${PROGRAM_OFFER} ${eligibility()}`;
}

/** "## Plans and limits" section for /llm-context.md, as a markdown table. */
export function llmContextPlansSection(): string {
  const rows = FEATURES.filter((f) => f.section === "comparison");
  const header = `| | ${PLANS.map((p) => p.name).join(" | ")} |`;
  const divider = `|---|${PLANS.map(() => "---").join("|")}|`;
  const body = rows
    .map(
      (f) =>
        `| ${f.name} | ${PLANS.map((p) => cellText(f.plans[p.name])).join(
          " | "
        )} |`
    )
    .join("\n");

  return `## Plans and Limits

Current plans and included limits, from ${HOST}/pricing (check there for the latest prices, overage rates, and the full feature comparison):

${header}
${divider}
${body}

Startups: ${PROGRAM_OFFER} ${eligibility()} Details: ${HOST}/startups`;
}
