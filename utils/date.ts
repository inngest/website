const ISO_DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Short locale date for blog/changelog lists (e.g. 5/1/2026).
 * YYYY-MM-DD frontmatter is parsed as UTC midnight; formatting in the local
 * timezone shifts the calendar day behind the US. Use UTC for date-only values.
 */
export function formatShortLocaleDate(input: string | Date): string {
  if (typeof input === "string") {
    const m = ISO_DATE_ONLY.exec(input.trim());
    if (m) {
      const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      return new Date(t).toLocaleDateString("en-US", { timeZone: "UTC" });
    }
    return new Date(input).toLocaleDateString("en-US");
  }

  if (
    input.getUTCHours() === 0 &&
    input.getUTCMinutes() === 0 &&
    input.getUTCSeconds() === 0 &&
    input.getUTCMilliseconds() === 0
  ) {
    return input.toLocaleDateString("en-US", { timeZone: "UTC" });
  }

  return input.toLocaleDateString("en-US");
}

export function formatDate(date: string) {
  const m = ISO_DATE_ONLY.exec(date.trim());
  if (m) {
    const t = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return new Date(t).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
