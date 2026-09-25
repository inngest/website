/**
 * SF campaign typography + accent.
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
