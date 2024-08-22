import React from "react";
import { Button } from "../Button";
import { type Plan } from "../../pages/pricing";
import { RiGitPrDraftLine, RiMistLine, RiCheckLine } from "@remixicon/react";

export default function PlanCard({ content }: { content: Plan }) {
  const price = content.cost.between
    ? `$${content.cost.basePrice}-${content.cost.endPrice}`
    : content.cost.basePrice;

  return (
    <div
      className={`w-full rounded-lg md:rounded-l-none md:rounded-r-none md:first:rounded-l-lg md:last:rounded-r-lg flex flex-col justify-between text-left `}
    >
      <div
        className={`h-full py-8 px-6 border rounded-2xl ${
          content.recommended ? "border-matcha-400" : "border-muted"
        } bg-canvasBase`}
      >
        {content.recommended && (
          <div className="-mt-10 mb-3.5 block text-center">
            <div className="bg-gradient-to-b from-matcha-400 to-breeze-400 inline-block shadow-lg rounded-full text-onContrast text-sm font-semibold tracking-tight py-0.5 px-2">
              Recommended
            </div>
          </div>
        )}
        {/* Prevent weird button wrap on enterprise from mis-aligning rows */}
        <div className="sm:min-h-[272px] min-[933px]:min-h-[252px] min-[1272px]:min-h-0">
          <h2 className="text-3xl font-semibold">{content.name}</h2>
          <p className="text-sm pt-2">{content.description}</p>
          {content.cost.between ? (
            <p className="uppercase font-bold text-xs bg-gradient-to-b from-matcha-400 to-breeze-400 bg-clip-text text-transparent pt-4">
              Between
            </p>
          ) : content.cost.startsAt ? (
            <p className="uppercase font-bold text-xs bg-gradient-to-b from-matcha-400 to-breeze-400 bg-clip-text text-transparent pt-4">
              Starting at
            </p>
          ) : (
            <div className="pt-8" />
          )}
          <p className={`text-3xl	lg:text-6xl mt-4 font-medium tracking-tight`}>
            {typeof price === "string" ? price : "$" + price}
            <span className={`text-xl lg:text-2xl font-normal ml-0.5 `}>
              {!!content.cost.period ? `/${content.cost.period}` : ""}
            </span>
          </p>

          <div className="my-8">
            <Button
              href={content.cta.href}
              full
              variant={content.recommended ? "primary" : "outline"}
              className={
                content.recommended &&
                "border border-transparent bg-primary-intense"
              }
            >
              {content.cta.text}
            </Button>
          </div>

          <hr className="border-muted my-8" />

          <p className="flex items-center gap-2 mb-3">
            <RiMistLine className="text-muted" />
            {content.highlights.runs}
          </p>
          <p className="flex items-center gap-2  mb-3">
            <RiGitPrDraftLine className="text-muted rotate-90" />
            {content.highlights.concurrency}
          </p>
        </div>

        <hr className="border-subtle my-8" />

        <p className="font-medium text-xs bg-gradient-to-b from-matcha-400 to-breeze-400 bg-clip-text text-transparent">
          {content.planIncludes}
        </p>
        <ul className="flex flex-col">
          {content.features.map((feature, i) => (
            <li key={i} className={`flex gap-2 py-3 last:pb-0`}>
              <RiCheckLine className="text-muted" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
