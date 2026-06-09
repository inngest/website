// Shared "<label> →" cue rendered inside a card whose whole surface is
// the link, so this is presentational — it reacts to the card's
// `group/card` hover. Native-only cap-trim (`.v1-trim`) because it's an
// inline-flex row: a `text-v1-*` token's ::before/::after trim fallback
// would become flex items here. Type matches "Label/Md" (16px Mono).
//
// `label` defaults to "Register" (Events cards); the blog-redesign
// related cards pass "Read Article".
export default function RegisterCue({ label = "Register" }: { label?: string }) {
  return (
    <span className="v1-trim font-v1Label inline-flex items-center gap-[10px] text-[16px] font-normal uppercase leading-[16px] text-v1-alwaysWhite motion-safe:transition-colors group-hover/card:text-v1-accent-salmon">
      {label}
      <span
        aria-hidden="true"
        className="inline-block motion-safe:transition-transform motion-safe:duration-[400ms] motion-safe:ease-v1-in group-hover/card:translate-x-[6px]"
      >
        →
      </span>
    </span>
  );
}
