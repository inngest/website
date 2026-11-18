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

/** Remembers who signed up (email only, before the raffle opens) so
 *  the form can prefill and offer one-click entries later. */
export function saveDetails(name: string, email: string) {
  const prev = read();
  const next: RaffleState = {
    days: prev.days,
    name: name || prev.name,
    email,
  };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // noop
  }
  window.dispatchEvent(new CustomEvent(CHANGED, { detail: next }));
}

/**
 * Whether this browser has signed up for the daily door emails. Entering
 * a raffle signs people up too, so both set it.
 */
const SUBSCRIBED_KEY = "12-days-of-workflows:subscribed";
const SUBSCRIBED_CHANGED = "12-days:subscribed-changed";

export function markSubscribed() {
  try {
    window.localStorage.setItem(SUBSCRIBED_KEY, "1");
  } catch {
    // Still subscribed; the form just shows again next visit.
  }
  window.dispatchEvent(new Event(SUBSCRIBED_CHANGED));
}

export function useSubscribed(): boolean {
  const [subscribed, setSubscribed] = useState(false);
  useEffect(() => {
    const check = () => {
      try {
        setSubscribed(Boolean(window.localStorage.getItem(SUBSCRIBED_KEY)));
      } catch {
        // Blocked storage: show the form.
      }
    };
    check();
    const onChange = () => setSubscribed(true);
    window.addEventListener(SUBSCRIBED_CHANGED, onChange);
    return () => window.removeEventListener(SUBSCRIBED_CHANGED, onChange);
  }, []);
  return subscribed;
}

const PROMPTED_KEY = "12-days-of-workflows:raffle-prompted";

/**
 * True the first time it's called for `day` in this browser, and false
 * after: the pop-up opens on its own at most once a day, so closing it
 * sticks. The buttons still open it any time.
 */
export function claimAutoPrompt(day: number): boolean {
  if (read().days.includes(day)) return false;
  try {
    const raw = window.localStorage.getItem(PROMPTED_KEY);
    const prompted: unknown = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(prompted) ? prompted : [];
    if (list.includes(day)) return false;
    window.localStorage.setItem(PROMPTED_KEY, JSON.stringify([...list, day]));
    return true;
  } catch {
    // Blocked storage: don't nag on every visit.
    return false;
  }
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
