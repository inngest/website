import Link from "next/link";
import type { FeaturedPattern } from "./featuredPattern";
export { FEATURED_PATTERN } from "./featuredPattern";
import type { PatternItem, PatternSection } from "./patternsData";

import "./featured.css";

type Props = {
  featured: FeaturedPattern;
  section: PatternSection;
  pattern: PatternItem;
};

export default function Featured({ featured, section, pattern }: Props) {
  const date = new Date(featured.publishedAt + "T00:00:00Z");
  const dateStr = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const positionInSection =
    section.patterns.findIndex((p) => p.slug === pattern.slug) + 1;

  return (
    <section className={`featured ${section.accent.text}`}>
      <div className="featured-rule">
        <span className="featured-rule-tag">
          <span className="featured-rule-dot" aria-hidden />
          {featured.label}
        </span>
        <span className="featured-rule-line" />
        <span className="featured-rule-meta">
          {dateStr.toUpperCase()} · {featured.readTime.toUpperCase()}
        </span>
      </div>

      <div className="featured-card">
        <div className="featured-card-body">
          <div className="featured-card-tag">
            <span className="featured-card-tag-num">{section.number}</span>
            <span className="featured-card-tag-name">{section.name}</span>
          </div>

          <h2 className="featured-card-title">{pattern.title}</h2>
          <p className="featured-card-excerpt">{featured.excerpt}</p>

          {featured.highlights.length > 0 && (
            <ul className="featured-card-highlights">
              {featured.highlights.map((h, i) => (
                <li key={i}>
                  <span className="featured-card-highlight-marker" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="featured-card-cta-row">
            <Link href={`/docs/patterns/${pattern.slug}`} className="featured-card-cta">
              <span>Read the pattern</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7 L11 7 M7 3 L11 7 L7 11"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="featured-card-side">
          <div className="featured-card-side-meta">
            <Row label="Section" value={section.name} />
            <Row
              label="Pattern"
              value={`${String(positionInSection).padStart(2, "0")} / ${String(
                section.patterns.length
              ).padStart(2, "0")}`}
            />
            <Row label="Published" value={dateStr} />
            <Row label="Read" value={featured.readTime} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="featured-card-side-row">
      <span className="featured-card-side-label">{label}</span>
      <span className="featured-card-side-value">{value}</span>
    </div>
  );
}
