import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Build-a-thon entries from /12-days-of-workflows/build-a-thon. Each one
 * is posted to the team's Slack channel through an incoming webhook
 * (SLACK_BUILDATHON_WEBHOOK_URL in Vercel).
 *
 * Runs on the server so an ad blocker that stops Segment in the browser
 * can't lose an entry. The form still sends its Segment event for
 * attribution.
 */

const FIELDS = [
  "name",
  "email",
  "company",
  "linkedin",
  "vercel",
  "github",
  "description",
] as const;

type Entry = Record<typeof FIELDS[number], string>;

const MAX_LENGTH = { description: 500, default: 300 };

const PATTERNS: Partial<Record<keyof Entry, RegExp>> = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  linkedin: /^https:\/\/(www\.)?linkedin\.com\/.+/,
  vercel: /^https:\/\/.+/,
  github: /^https:\/\/(www\.)?github\.com\/[^/]+\/[^/]+/,
};

const OPTIONAL = new Set<keyof Entry>(["description"]);

/** Read and check one entry. Returns the problem as a string if it's bad. */
function parse(body: unknown): Entry | string {
  if (!body || typeof body !== "object") return "Invalid request";
  const raw = body as Record<string, unknown>;
  const entry = {} as Entry;
  for (const key of FIELDS) {
    const value = typeof raw[key] === "string" ? raw[key].trim() : "";
    const max =
      key === "description" ? MAX_LENGTH.description : MAX_LENGTH.default;
    if (!value && !OPTIONAL.has(key)) return `${key} is required`;
    if (value.length > max) return `${key} is too long`;
    if (value && PATTERNS[key] && !PATTERNS[key].test(value)) {
      return `${key} doesn't look right`;
    }
    entry[key] = value;
  }
  return entry;
}

/**
 * Slack treats <, > and & as markup, so a submitted value could
 * otherwise turn into a link or an @channel.
 */
function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** A Slack link. A "|" in the URL would end it early, so encode it. */
function link(url: string, label: string): string {
  return `<${escape(url).replace(/\|/g, "%7C")}|${label}>`;
}

function slackMessage(entry: Entry, ref: string) {
  const name = escape(entry.name);
  const company = escape(entry.company);
  const fields = [
    `*Name*\n${name}`,
    `*Company*\n${company}`,
    `*Email*\n${escape(entry.email)}`,
    `*LinkedIn*\n${link(entry.linkedin, "Profile")}`,
    `*Vercel preview*\n${link(entry.vercel, "Open the preview")}`,
    `*GitHub*\n${link(entry.github, "Open the repo")}`,
  ];
  return {
    text: `New build-a-thon entry from ${name} (${company})`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "🧪 New build-a-thon entry" },
      },
      {
        type: "section",
        fields: fields.map((text) => ({ type: "mrkdwn", text })),
      },
      ...(entry.description
        ? [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*What it does*\n${escape(entry.description)}`,
              },
            },
          ]
        : []),
      ...(ref
        ? [
            {
              type: "context",
              elements: [{ type: "mrkdwn", text: `ref: ${escape(ref)}` }],
            },
          ]
        : []),
    ],
  };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: a hidden field people never see. Bots that fill in every
  // input get a normal-looking success and nothing is posted.
  const raw = body as Record<string, unknown> | null;
  if (raw && typeof raw.website === "string" && raw.website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const entry = parse(body);
  if (typeof entry === "string") {
    return NextResponse.json({ error: entry }, { status: 400 });
  }
  const ref =
    raw && typeof raw.ref === "string" ? raw.ref.trim().slice(0, 100) : "";

  const webhook = process.env.SLACK_BUILDATHON_WEBHOOK_URL;
  if (!webhook) {
    // Local development has no webhook; log the entry instead. Anywhere
    // else, fail so the form says so rather than dropping the entry.
    if (process.env.NODE_ENV === "development") {
      console.log("Build-a-thon entry (no Slack webhook set)", entry);
      return NextResponse.json({ ok: true }, { status: 201 });
    }
    console.error("SLACK_BUILDATHON_WEBHOOK_URL is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slackMessage(entry, ref)),
    });
    if (!res.ok) {
      console.error("Slack webhook failed", res.status, await res.text());
      return NextResponse.json({ error: "Couldn't send" }, { status: 502 });
    }
  } catch (err) {
    console.error("Slack webhook failed", err);
    return NextResponse.json({ error: "Couldn't send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
