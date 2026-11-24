"use client";

import { useEffect, useRef, useState } from "react";
import { prizeFor, RAFFLE } from "@/components/v1/sections/TwelveDays/data";
import JoinForm from "@/components/v1/sections/TwelveDays/JoinForm";
import PrizePanel from "@/components/v1/sections/TwelveDays/PrizePanel";
import { useRaffleOpenRequests } from "@/components/v1/sections/TwelveDays/useRaffle";

/**
 * The daily raffle pop-up. Mounted once on the page; opened by
 * `openRaffle(day)` from today's door or the raffle section. It holds
 * the same form as the calendar (JoinForm), so entering here also signs
 * people up for the daily emails. A native modal <dialog>, so focus
 * stays inside and Escape closes it.
 */
export default function RaffleDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [day, setDay] = useState<number | null>(null);
  const copy = RAFFLE.dialog;
  const close = () => ref.current?.close();

  useRaffleOpenRequests((d) => {
    setDay(d);
    if (!ref.current?.open) ref.current?.showModal();
  });

  // Clicking the backdrop (the dialog element itself) closes it.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === dialog) dialog.close();
    };
    dialog.addEventListener("click", onClick);
    return () => dialog.removeEventListener("click", onClick);
  }, []);

  const prize = day !== null ? prizeFor(day) : undefined;

  return (
    <dialog
      ref={ref}
      aria-labelledby="raffle-title"
      className="m-auto w-[calc(100%-32px)] max-w-[480px] overflow-visible rounded-xl border-[3px] border-[#020202] bg-[#F7DA10] p-0 text-[#020202] shadow-[8px_8px_0_#020202] backdrop:bg-[#020202]/60"
    >
      <div className="relative flex flex-col gap-5 p-6 sm:p-8">
        <button
          type="button"
          onClick={close}
          aria-label={copy.close}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md border-2 border-[#020202] bg-white text-[18px] leading-none hover:bg-[#020202] hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#020202]"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="flex flex-col gap-2 pr-10">
          <p className="font-v1Label text-[13px]">{RAFFLE.eyebrow}</p>
          <h2
            id="raffle-title"
            className="font-sans text-[32px] font-black leading-[1] tracking-[-0.02em]"
          >
            {day !== null ? copy.title(day) : RAFFLE.eyebrow}
          </h2>
        </div>

        {prize && (
          <div className="flex items-center gap-4 rounded-lg border-2 border-[#020202] bg-[#020202] p-3 text-white">
            <PrizePanel
              prize={prize}
              className="h-16 w-20 shrink-0 !p-1.5"
              sizes="64px"
              emojiClassName="text-[32px]"
            />
            <span className="flex min-w-0 flex-col">
              <span className="font-v1Label text-[12px] text-[#F7DA10]">
                {RAFFLE.todaysPrize}
              </span>
              <span className="font-sans text-[18px] font-black leading-[1.15]">
                {prize.prize}
              </span>
            </span>
          </div>
        )}
        <p className="text-[16px] leading-[24px]">{copy.body}</p>

        {day !== null && (
          <JoinForm
            key={day}
            day={day}
            tone="yellow"
            id="raffle"
            onLeave={close}
            onClose={close}
          />
        )}
      </div>
    </dialog>
  );
}
