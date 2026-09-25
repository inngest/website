/**
 * SF campaign typography, accent and section rhythm.
 *
 * The SF design moves section headings off the uppercase `V1_SECTION_TITLE`
 * used elsewhere on the site and into sentence case, and swaps the salmon
 * accent for the brand green. Both are scoped to this page — NYC and the
 * city-agnostic cut keep the shared uppercase title and salmon.
 */

/** Sentence-case section heading: Heading/Md on mobile stepping up to
 *  Display/Xs at lg. Built from type tokens rather than a clamp so it
 *  stays on the documented scale. */
export const SF_SECTION_TITLE =
  "text-v1-heading-card text-v1-frost lg:text-v1-display-xs";

/** The campaign accent on this page. */
export const SF_ACCENT = "text-v1-accent-green";

/**
 * Section padding for the SF page. The shared `Section` box runs
 * 80/96/160 vertical, which stacks to 320px between two adjacent
 * sections — far looser than this design. These override it to
 * 64/80/96, so adjacent sections sit ~192px apart instead.
 *
 * Scoped to SF: the shared recipe is unchanged for every other v1 page.
 */
export const SF_SECTION_PADDING = "!py-16 sm:!py-20 lg:!py-24";
