"use client";

import { useEffect, useState } from "react";

/**
 * The calendar's clock. `null` until mounted, so the server render and
 * the first client render agree (every door closed, no countdown) and
 * the real state paints right after hydration.
 *
 * Off production you can time-travel with `?now=2026-12-05T08:00:00Z`
 * to see the calendar on any day. Production ignores it, so nobody can
 * peek behind tomorrow's door with a URL.
 */
export function useCalendarClock(): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let offset = 0;
    if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") {
      const override = new URLSearchParams(window.location.search).get("now");
      const t = override ? Date.parse(override) : NaN;
      if (!Number.isNaN(t)) offset = t - Date.now();
    }

    const tick = () => setNow(new Date(Date.now() + offset));
    tick();
    // Once a second keeps the countdown honest and pops the next door
    // within a second of midnight for anyone watching it happen.
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}

/** "2d 04:11:09" — days only once there's at least one. */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d > 0 ? `${d}d ` : ""}${pad(h)}:${pad(m)}:${pad(s)}`;
}

const PROGRESS_KEY = "12-days-of-workflows:done";

/**
 * Which lessons this visitor has marked done. Lives in this browser
 * only, so every read and write is allowed to fail.
 */
export function useLessonProgress() {
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PROGRESS_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setDone(parsed.filter((n): n is number => typeof n === "number"));
      }
    } catch {
      // Private mode or blocked storage: start empty.
    }
  }, []);

  const toggle = (day: number) => {
    setDone((prev) => {
      const next = prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort((a, b) => a - b);
      try {
        window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      } catch {
        // Still works for this visit.
      }
      return next;
    });
  };

  return { done, toggle };
}

const OPENED_KEY = "12-days-of-workflows:opened";

/**
 * Doors this visitor has opened by hand. Today's door waits to be held
 * open; once it has been, it stays open on later visits.
 */
export function useOpenedDoors() {
  const [opened, setOpened] = useState<number[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(OPENED_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setOpened(parsed.filter((n): n is number => typeof n === "number"));
      }
    } catch {
      // Private mode or blocked storage: every door waits to be held.
    }
  }, []);

  const markOpened = (day: number) => {
    setOpened((prev) => {
      if (prev.includes(day)) return prev;
      const next = [...prev, day];
      try {
        window.localStorage.setItem(OPENED_KEY, JSON.stringify(next));
      } catch {
        // Still open for this visit.
      }
      return next;
    });
  };

  return { opened, markOpened };
}
