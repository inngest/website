/**
 * Standard v1 `<section>` box spacing — the single source of truth for
 * section padding (see docs/v1-design-system.md). Section spacing is a
 * *responsive compound*, so it lives as className recipes, not a token.
 *
 *   Gutters (horizontal): 24 → 36 → 32px  (px-6 / px-9 / px-8)
 *   Vertical padding:     80 → 96 → 160px (py-20 / py-24 / py-40)
 *
 * Use the `<Section>` component for new/migrated sections (it applies these
 * to the right elements). The combined `V1_SECTION_SHELL` is for sections
 * that aren't on the component yet — compose with `cn()`:
 *   <section className={cn(V1_SECTION_SHELL, "relative mx-auto w-full max-w-[1440px]")}>
 */
export const V1_SECTION_GUTTER_X = "px-6 sm:px-9 lg:px-8";
export const V1_SECTION_PADDING_Y = "py-20 sm:py-24 lg:py-40";
export const V1_SECTION_SHELL = `${V1_SECTION_GUTTER_X} ${V1_SECTION_PADDING_Y}`;

/**
 * Header → content gap when a section title leads straight into its content:
 * 48px on mobile, 96px from lg. The flat 96 reads as a
 * floating title on small screens, so it's halved on mobile — matching the
 * Home/Pricing HowItWorks rhythm. Apply as a top margin on the content block
 * below a `<SectionHeader>`:
 *   <div className={`${V1_HEADER_CONTENT_MT} grid …`}>
 */
export const V1_HEADER_CONTENT_MT = "mt-v1-stack lg:mt-v1-stack-lg";
