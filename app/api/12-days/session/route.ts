import { NextResponse } from "next/server";
import { REF } from "@/components/v1/sections/TwelveDays/data";
import { inngest, SIGNED_IN } from "@/utils/twelveDays/functions";
import { verifyPass } from "@/utils/twelveDays/pass";
import {
  cookieFrom,
  createSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  SESSION_PATH,
} from "@/utils/twelveDays/session";
import { claimPass } from "@/utils/twelveDays/store";

export const runtime = "nodejs";

/**
 * POST { pass } — trades the app's sign-in pass (see
 * utils/twelveDays/pass.ts) for the website's 12 Days session cookie,
 * which the check-in route reads. Each pass works once.
 *
 * Also sends `website/12-days.signed-in` with the visitor's anonymous id,
 * tying the account to its earlier visits to the website for campaign
 * attribution.
 */
export async function POST(req: Request) {
  let body: { pass?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let pass;
  try {
    pass = verifyPass(body.pass);
  } catch (error) {
    console.error("12 Days sign-in pass can't be checked", error);
    return NextResponse.json(
      { error: "Sign-in is not configured" },
      { status: 503 }
    );
  }
  if (!pass) {
    return NextResponse.json(
      { error: "Invalid or expired pass" },
      { status: 401 }
    );
  }

  try {
    const ttl = pass.expiresAt - Date.now() / 1000 + 60;
    if (!(await claimPass(pass.id, ttl))) {
      return NextResponse.json({ error: "Pass already used" }, { status: 401 });
    }
  } catch (error) {
    // Without the store a pass could be replayed, so only development
    // goes on without it.
    if (process.env.NODE_ENV !== "development") {
      console.error("12 Days sign-in pass can't be claimed", error);
      return NextResponse.json(
        { error: "Sign-in is not configured" },
        { status: 503 }
      );
    }
    console.log("Skipping the single-use pass check in development");
  }

  let session: string;
  try {
    session = createSession({ id: pass.userId, email: pass.email });
  } catch (error) {
    console.error("12 Days session can't be signed", error);
    return NextResponse.json(
      { error: "Sign-in is not configured" },
      { status: 503 }
    );
  }

  const event = {
    id: `12dow-signin-${pass.id}`,
    name: SIGNED_IN,
    data: {
      userId: pass.userId,
      email: pass.email,
      newAccount: pass.newAccount,
      ref: REF,
      anonymousId: cookieFrom(req, "inngest_anonymous_id") ?? null,
    },
  };
  // Attribution only: a failure here mustn't stop the sign-in.
  if (process.env.NODE_ENV === "development" && !process.env.INNGEST_DEV) {
    console.log("Skipping 12 Days sign-in event in development", event);
  } else {
    try {
      await inngest.send(event);
    } catch (error) {
      console.error("12 Days sign-in event failed", error);
    }
  }

  const res = NextResponse.json({ email: pass.email });
  res.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: SESSION_PATH,
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
