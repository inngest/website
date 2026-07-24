"use client";
import { useState } from "react";

import Card from "./Card";
import { Tabs } from "src/components/Tabs";

export default function PlatformComparison() {
  const [visibleCard, setVisibleCard] = useState<number>(0);
  return (
    <div className="max-w-4xl mx-auto my-16 text-center">
      <h3 className="text-xl text-body font-medium">
        Everything that Inngest replaces
      </h3>
      <div className="my-4 flex flex-row gap-4 items-center justify-center">
        <Tabs
          content={[{ title: "Without Inngest" }, { title: "With Inngest" }]}
          setSelected={setVisibleCard}
          selected={visibleCard}
        />
      </div>
      {visibleCard === 0 ? (
        <Card img="/assets/platform/existing-tools.png" />
      ) : (
        <Card img="/assets/platform/with-inngest.png" />
      )}
    </div>
  );
}
