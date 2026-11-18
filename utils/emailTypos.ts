/**
 * Catches mistyped email domains before a form is sent: a typo'd ending
 * (`.con`, `.cmo`) or a near miss on a big mail provider (`@gnail.com`,
 * `@yaho.com`). Anything else, including work addresses on domains we've
 * never seen, passes; this is a typo check, not an allow list.
 *
 * Shared by the browser forms and the server routes, so it has no
 * dependencies.
 */

/** Real providers. An exact match always passes. */
const PROVIDERS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "mail.com",
  "email.com",
  "inbox.com",
  "gmx.de",
  "web.de",
  "qq.com",
  "163.com",
  "naver.com",
  "yahoo.co.uk",
  "hotmail.co.uk",
  "yahoo.co.jp",
  "zoho.com",
  "fastmail.com",
  "hey.com",
  "yandex.com",
  "comcast.net",
  "verizon.net",
  "att.net",
];

/**
 * Endings that are almost always a typo, and what was meant. Real but
 * rare country codes that sit one key from `.com` (`.cm`, `.om`, `.co`)
 * are left out so people on them can still sign up.
 */
const TLD_TYPOS: Record<string, string> = {
  con: "com",
  cmo: "com",
  cpm: "com",
  ocm: "com",
  comm: "com",
  coom: "com",
  vom: "com",
  xom: "com",
  cim: "com",
  cpom: "com",
  c0m: "com",
  copm: "com",
  nett: "net",
  nte: "net",
  ner: "net",
  ogr: "org",
  orgg: "org",
  rog: "org",
  irg: "org",
  eud: "edu",
  deu: "edu",
};

/** Edit distance, counting a swap of two neighbours as one edit. */
function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0
    )
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

export interface EmailProblem {
  /** What to show under the field. */
  message: string;
  /** The corrected address, when there's an obvious one. */
  suggestion?: string;
}

/** Returns what's wrong with the address's domain, or null if it looks fine. */
export function checkEmailDomain(email: string): EmailProblem | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null; // The browser's own email check handles this.
  const local = email.slice(0, at).trim();
  const domain = email
    .slice(at + 1)
    .trim()
    .toLowerCase()
    .replace(/\.+$/, "");
  if (!domain.includes(".")) {
    return { message: "That email is missing its ending, like .com." };
  }

  if (PROVIDERS.includes(domain)) return null;

  const labels = domain.split(".");
  const tld = labels[labels.length - 1];
  const fixedTld = TLD_TYPOS[tld];
  const fixed = fixedTld
    ? [...labels.slice(0, -1), fixedTld].join(".")
    : domain;

  // A near miss on a big provider, after fixing the ending. The closest
  // one wins; ties go to whichever is listed first (the more common).
  const limit = fixed.length >= 10 ? 2 : 1;
  let provider: string | undefined;
  let best = Infinity;
  for (const p of PROVIDERS) {
    const d = distance(fixed, p);
    if (d < best) {
      best = d;
      provider = p;
    }
  }
  if (provider && best <= limit) {
    return {
      message: `Did you mean ${local}@${provider}?`,
      suggestion: `${local}@${provider}`,
    };
  }

  if (fixedTld) {
    return {
      message: `Did you mean ${local}@${fixed}?`,
      suggestion: `${local}@${fixed}`,
    };
  }

  return null;
}
