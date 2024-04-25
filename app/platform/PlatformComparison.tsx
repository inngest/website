"use client";
import { useState } from "react";
import clsx from "clsx";

import Card from "./Card";

export default function PlatformComparison() {
  const [visibleCard, setVisibleCard] = useState<"without" | "with">("without");
  return (
    <div className="max-w-4xl mx-auto my-16 text-center">
      <h3 className="text-xl text-body font-medium">
        Everything that Inngest replaces
      </h3>
      <div className="my-4 flex flex-row gap-4 items-center justify-center">
        <SelectButton
          onClick={() => setVisibleCard("without")}
          isActive={visibleCard === "without"}
        >
          Without Inngest
        </SelectButton>
        <SelectButton
          onClick={() => setVisibleCard("with")}
          isActive={visibleCard === "with"}
        >
          With Inngest
        </SelectButton>
      </div>
      {visibleCard === "without" ? (
        <Card img="/assets/platform/existing-tools.png" />
      ) : (
        <Card img="/assets/platform/with-inngest.png" />
      )}
    </div>
  );
}

function SelectButton({ onClick, isActive, children }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `px-6 py-2 font-medium tracking-tight rounded-full text-white transition-all`,
        isActive ? `bg-primary` : `bg-slate-600/80 hover:bg-slate-500/80`
      )}
    >
      {children}
    </button>
  );
}
