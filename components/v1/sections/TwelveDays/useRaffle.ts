"use client";

import { useEffect, useRef, useState } from "react";

/**
 * This browser's raffle state: which days it has entered, and the name
 * and email it entered with (so day two onward is one click). Shared by
 * the doors, the raffle section and the pop-up through window events,
 * so entering in one place updates the others.
 *
 * Only a convenience: the real record of entries is the Segment event
 * and the sheet row, and duplicates per person per day are removed at
 * draw time.
 */

const KEY = "12-days-of-workflows:raffle";
const CHANGED = "12-days:raffle-changed";
const OPEN = "12-days:raffle-open";

export type RaffleState = { days: number[]; name: string; email: string };

const EMPTY: RaffleState = { days: [], name: "", email: "" };

function read(): RaffleState {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(KEY) ?? "null"
    ) as Partial<RaffleState> | null;
    if (!parsed || typeof parsed !== "object") return EMPTY;
    return {
      days: Array.isArray(parsed.days)
        ? parsed.days.filter((d): d is number => typeof d === "number")
        : [],
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
    };
  } catch {
    return EMPTY;
  }
}

/** Records an entry for `day` and tells every listener. */
export function saveEntry(day: number, name: string, email: string) {
  const prev = read();
  const next: RaffleState = {
    days: prev.days.includes(day) ? prev.days : [...prev.days, day],
    name,
    email,
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Blocked storage: the entry still went through.
  }
  window.dispatchEvent(new CustomEvent(CHANGED, { detail: next }));
}

/** Opens the raffle pop-up for `day` (RaffleDialog listens). */
export function openRaffle(day: number) {
  window.dispatchEvent(new CustomEvent(OPEN, { detail: day }));
}

export function useRaffleState(): RaffleState {
  const [state, setState] = useState<RaffleState>(EMPTY);
  useEffect(() => {
    setState(read());
    const onChange = (e: Event) =>
      setState((e as CustomEvent<RaffleState>).detail);
    window.addEventListener(CHANGED, onChange);
    return () => window.removeEventListener(CHANGED, onChange);
  }, []);
  return state;
}

/** Calls `handler(day)` whenever something asks for the pop-up. */
export function useRaffleOpenRequests(handler: (day: number) => void) {
  const latest = useRef(handler);
  latest.current = handler;
  useEffect(() => {
    const onOpen = (e: Event) =>
      latest.current((e as CustomEvent<number>).detail);
    window.addEventListener(OPEN, onOpen);
    return () => window.removeEventListener(OPEN, onOpen);
  }, []);
}
