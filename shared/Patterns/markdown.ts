import type { FeaturedPattern } from "./featuredPattern";
import type { PatternSection } from "./patternsData";

/**
 * Build the markdown view of /docs/patterns/ index.
 * Includes the featured pattern at the top so agents pulling fresh
 * context see the newest material first.
 */
export function indexMarkdown(
  sections: PatternSection[],
  featured?: FeaturedPattern
): string {
  const lines: string[] = [];
  lines.push("# Inngest Patterns", "");
  lines.push(
    "> Production-tested patterns for AI agents, durable workflows, and the event-driven systems they live in. Each pattern is built on Inngest primitives (steps, events, throttling, schedules, channels) and the guarantees they provide.",
    ""
  );
  lines.push("URL: https://www.inngest.com/docs/patterns");
  lines.push(`Sections: ${sections.length}`);
  const total = sections.reduce((acc, s) => acc + s.patterns.length, 0);
  lines.push(`Total patterns: ${total}`, "");

  if (featured) {
    const section = sections.find((s) => s.id === featured.sectionId);
    const pattern = section?.patterns.find((p) => p.slug === featured.slug);
    if (section && pattern) {
      lines.push("---", "");
      lines.push(`## ⭐ ${featured.label}: ${pattern.title}`, "");
      lines.push(
        `*${section.number} · ${section.name} · published ${featured.publishedAt} · ${featured.readTime}*`,
        ""
      );
      lines.push(featured.excerpt, "");
      if (featured.highlights.length > 0) {
        featured.highlights.forEach((h) => lines.push(`- ${h}`));
        lines.push("");
      }
      lines.push(`Read: \`/docs/patterns/${pattern.slug}\``, "");
    }
  }

  lines.push("---", "", "## Table of contents", "");
  sections.forEach((s) => {
    lines.push(
      `- **${s.number} · ${s.name}**: ${s.kicker} (${s.patterns.length} patterns)`
    );
  });
  lines.push("", "---", "");

  sections.forEach((s) => {
    lines.push(`## ${s.number} · ${s.name}`, "", `*${s.kicker}*`, "");
    lines.push(s.description, "");
    lines.push("### Patterns", "");
    s.patterns.forEach((p) => {
      lines.push(`- **[${p.title}](/docs/patterns/${p.slug})**: ${p.subtitle}`);
    });
    lines.push("");
  });

  return lines.join("\n");
}

/**
 * Build the markdown view of a single category (primitive) page.
 */
export function categoryMarkdown(section: PatternSection): string {
  const lines: string[] = [];
  lines.push(`# ${section.name}`, "");
  lines.push(`> ${section.kicker}`, "");
  lines.push(`URL: https://www.inngest.com/docs/patterns/${section.id}`, "");
  lines.push(section.description, "", "## Patterns", "");
  section.patterns.forEach((p) => {
    lines.push(
      `- **[${p.title}](/docs/patterns/${section.id}/${p.slug})**: ${p.subtitle}`
    );
  });
  return lines.join("\n") + "\n";
}

/**
 * Build the markdown view of a single pattern page.
 * Composes the frontmatter into a header and appends the raw MDX body.
 */
export function patternMarkdown(
  title: string,
  subtitle: string,
  slug: string,
  tags: string[],
  body: string
): string {
  const lines: string[] = [];
  lines.push(`# ${title}`, "");
  if (subtitle) lines.push(`> ${subtitle}`, "");
  lines.push(`URL: https://www.inngest.com/docs/patterns/${slug}`);
  if (tags.length > 0) lines.push(`Tags: ${tags.join(", ")}`);
  lines.push("", "---", "");
  lines.push(body.trim());
  return lines.join("\n") + "\n";
}
