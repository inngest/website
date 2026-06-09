import { springs, tweens } from "@/utils/v1/springs";

/**
 * v1 scroll-reveal vocabulary. Four named patterns mapping the four
 * tiers of visual hierarchy:
 *
 *   heading  — section h2 / display titles
 *   body     — paragraphs, eyebrows, supporting copy
 *   item(i)  — cards / list items, staggered by document order
 *   accent   — step numbers, status dots, badges, small icons
 *
 * Spread directly onto a `<motion.X>` element:
 *
 *   <motion.h2 {...reveals.heading}>…</motion.h2>
 *   <motion.p  {...reveals.body}>…</motion.p>
 *   {items.map((it, i) => (
 *     <motion.li key={it.id} {...reveals.item(i)}>…</motion.li>
 *   ))}
 *   <motion.span {...reveals.accent}>•</motion.span>
 *
 * Triggers via motion's `whileInView` with `viewport.once` — each
 * element animates once when it scrolls into the viewport (and on
 * load if it's already in view). The `-10%` bottom margin gives a
 * little anticipation: reveals fire when the element is 10% in,
 * not at the edge.
 *
 * Signature beats (hero entrance, paint-collapse landmarks, quote
 * character flood) stay bespoke — they only fire once per page on
 * landmarks. These tokens are for the quiet ambient reveals
 * everywhere else.
 */

const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

export const reveals = {
  // 32 px translateY across all three tiers — matches the existing
  // useScrollReveal vocabulary used by GoDeeper / ScaleInstantly so
  // the two systems look identical to the eye. The distinguisher is
  // delay, not distance.
  heading: {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT,
    transition: tweens.entry,
  },
  body: {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT,
    // Trails the heading by ~120 ms so the title arrives first and
    // the body settles in behind it.
    transition: { ...tweens.entry, delay: 0.12 },
  },
  /**
   * Per-item stagger: index-based 50 ms delay so a 6-card grid
   * cascades in over ~300 ms. Above ~10 items consider a smaller
   * step — long cascades start to feel slow.
   */
  item: (index: number) => ({
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT,
    transition: { ...tweens.entry, delay: index * 0.05 },
  }),
  /**
   * Small inline accents — dots, numbers, badges. Springs.bounce
   * gives a quiet pop without competing with the surrounding text.
   */
  accent: {
    initial: { opacity: 0, scale: 0.7 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: VIEWPORT,
    transition: springs.bounce,
  },
} as const;
