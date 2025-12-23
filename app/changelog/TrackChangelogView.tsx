"use client";
import { useCookie, useEffectOnce } from "react-use";

const COOKIE_NAME = "inngest_changelog_last_viewed";

// Pass the date as a YYYY-MM-DD format string
export default function TrackChangelogView({ date }: { date: string }) {
  const [value, setValue] = useCookie(COOKIE_NAME);
  useEffectOnce(() => {
    const sixMonthsFromNow = new Date(
      Date.now() + 6 * 30 * 24 * 60 * 60 * 1000
    );
    // Only set the latest changelog entry that they may have seen
    const latest = new Date(value);
    const viewed = new Date(date);
    if (viewed > latest) {
      setValue(viewed.toISOString(), {
        domain: process.env.NEXT_PUBLIC_HOSTNAME,
        path: "/",
        expires: sixMonthsFromNow,
        sameSite: "lax",
      });
    }
  });
  return <>{/* Render no-op */}</>;
}
