"use client";

import { useEffect, useState } from "react";
import {
  DAYS,
  unlockAt,
  unlockLabel,
} from "@/components/v1/sections/TwelveDays/data";
import { OPENED_KEY } from "@/components/v1/sections/TwelveDays/useCalendarClock";

/** 10am Eastern on the morning door `day` opens, as an ISO string. */
function morningOf(day: number): string {
  return new Date(unlockAt(day).getTime() + 10 * 3_600_000).toISOString();
}

const STOPS = [
  {
    key: "before",
    label: "Before launch",
    now: new Date(unlockAt(1).getTime() - 2 * 86_400_000).toISOString(),
  },
  ...DAYS.map((d) => ({
    key: String(d.day),
    label: `Day ${d.day}`,
    title: `${unlockLabel(d.day)} · ${d.primitive}`,
    now: morningOf(d.day),
  })),
  {
    key: "after",
    label: "All open",
    now: new Date(unlockAt(12).getTime() + 2 * 86_400_000).toISOString(),
  },
];

/**
 * A reviewer's time machine, shown everywhere except production. Each
 * button reloads the page at 10am Eastern on that door's day (through
 * the `?now=` override in useCalendarClock), so today's door is the one
 * to press and hold, and every earlier door is already open.
 *
 * "Reset doors" forgets which doors this browser has held open, so the
 * hold-to-open can be tested again.
 */
export default function PreviewClock() {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") return;
    setShow(true);
    // Starts folded on phones, where it would cover most of a door.
    setCollapsed(window.innerWidth < 640);
    setCurrent(new URLSearchParams(window.location.search).get("now"));
  }, []);

  if (!show) return null;

  const go = (now: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("now", now);
    url.hash = "calendar";
    // Picking the day you're already on only changes the hash, which
    // wouldn't reload, so reload explicitly.
    if (url.search === window.location.search) window.location.reload();
    else window.location.assign(url.toString());
  };

  const resetDoors = () => {
    try {
      window.localStorage.removeItem(OPENED_KEY);
    } catch {
      // Blocked storage: nothing was saved anyway.
    }
    window.location.reload();
  };

  return (
    <div
      role="region"
      aria-label="Preview controls"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-[720px] rounded-xl border-[3px] border-[#010101] bg-white p-3 font-v1Label text-[12px] uppercase text-[#010101] shadow-[4px_4px_0_#010101]"
    >
      <div className="flex items-center justify-between gap-3">
        <span>
          Preview only · jump to a day
          {current ? (
            <span className="ml-2 normal-case text-[#010101]/60">
              now = {current}
            </span>
          ) : null}
        </span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="underline underline-offset-4"
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>
      {!collapsed && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {STOPS.map((stop) => (
            <button
              key={stop.key}
              type="button"
              title={"title" in stop ? stop.title : undefined}
              onClick={() => go(stop.now)}
              className={`rounded-md border-2 border-[#010101] px-2 py-1 ${
                current === stop.now ? "bg-[#ECFE08]" : "bg-white"
              }`}
            >
              {stop.label}
            </button>
          ))}
          <button
            type="button"
            onClick={resetDoors}
            className="rounded-md border-2 border-[#010101] bg-[#F55C50] px-2 py-1 text-white"
          >
            Reset doors
          </button>
        </div>
      )}
    </div>
  );
}
