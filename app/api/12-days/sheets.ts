import { createSign } from "node:crypto";

/**
 * Appends rows to a Google Sheet as a service account, with no Google
 * SDK: a signed JWT is traded for an access token, then the Sheets API's
 * values.append adds the row.
 *
 * Set in Vercel (Sensitive), never in the repo:
 * - GOOGLE_SHEETS_CLIENT_EMAIL: the service account's email
 * - GOOGLE_SHEETS_PRIVATE_KEY: its private key (PEM; "\n" escapes are fine)
 * Then share the sheet with that email as an editor.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

let cached: { token: string; expires: number } | null = null;

function base64url(input: string | Buffer): string {
  return (typeof input === "string" ? Buffer.from(input) : input).toString(
    "base64url"
  );
}

async function accessToken(email: string, key: string): Promise<string> {
  if (cached && cached.expires > Date.now() + 60_000) return cached.token;

  const iat = Math.floor(Date.now() / 1000);
  const unsigned =
    base64url(JSON.stringify({ alg: "RS256", typ: "JWT" })) +
    "." +
    base64url(
      JSON.stringify({
        iss: email,
        scope: SCOPE,
        aud: TOKEN_URL,
        iat,
        exp: iat + 3600,
      })
    );
  const signature = createSign("RSA-SHA256")
    .update(unsigned)
    .sign(key.replace(/\\n/g, "\n"));
  const assertion = `${unsigned}.${base64url(signature)}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) {
    throw new Error(`Google token ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  cached = {
    token: data.access_token,
    expires: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

/**
 * Appends one row to `range` (e.g. "Entries!A:H") of `sheetId`. Values
 * are stored as typed (RAW), so a name starting with "=" stays text and
 * is never run as a formula. Returns false, and logs why, when the
 * credentials aren't set or Google refuses; never throws.
 */
export async function appendRow(
  sheetId: string,
  range: string,
  row: string[]
): Promise<boolean> {
  const email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const key = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  if (!email || !key || !sheetId) {
    console.warn("Google Sheets isn't configured; row not written", range);
    return false;
  }
  try {
    const token = await accessToken(email, key);
    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        sheetId
      )}/values/${encodeURIComponent(range)}:append?` +
      new URLSearchParams({
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
      });
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    });
    if (!res.ok) {
      console.error("Sheets append failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Sheets append failed", err);
    return false;
  }
}
