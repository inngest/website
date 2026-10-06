"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import Section from "@/components/v1/sections/shared/Section";
import { cn } from "@/utils/v1/cn";
import { reveals } from "@/utils/v1/reveals";

// Sandboxes & compute rate card. Sits between the SavingsQuote and the
// "Which plan is right for me?" calculator. Two base rates (vCPU, GB RAM)
// are always visible; a disclosure expands an example-size matrix of
// vCPU (powers of two, 1–16) × RAM ratio (1, 2, 4, 8 GB per vCPU).

const RATES = {
  cpu: { perSecond: 0.000011, perHour: 0.0396 },
  ram: { perSecond: 0.000003, perHour: 0.0108 },
} as const;

const CPU_SIZES = [1, 2, 4, 8, 16] as const;
const RAM_RATIOS = [1, 2, 4, 8] as const;

const RATE_ROWS = [
  {
    key: "cpu",
    unit: "1 vCPU",
    label: "Compute",
    rate: RATES.cpu,
    icon: <CpuIcon />,
  },
  {
    key: "ram",
    unit: "1 GB",
    label: "Memory",
    rate: RATES.ram,
    icon: <MemoryIcon />,
  },
] as const;

function hourlyCost(cpu: number, gb: number): number {
  return cpu * RATES.cpu.perHour + gb * RATES.ram.perHour;
}

function usd(v: number, digits: number): string {
  return `$${v.toFixed(digits)}`;
}

export default function ComputePricing() {
  const [showSizes, setShowSizes] = useState(false);
  const panelId = `compute-sizes-${useId()}`;

  return (
    <Section
      aria-labelledby="pricing-compute-heading"
      className="relative !pb-0 !pt-0 sm:!pt-0 lg:!pb-0 lg:!pt-0"
      containerClassName="mx-auto flex !max-w-[720px] flex-col gap-3"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="pricing-compute-heading"
          className="text-v1-label-sm uppercase tracking-[0.04em] text-v1-frost"
        >
          Sandboxes &amp; compute
        </h2>
        <p className="text-v1-body-xs text-v1-frost/60">
          Billed per second for vCPU and memory.
        </p>
      </div>

      <motion.div
        {...reveals.item(1)}
        className="overflow-hidden rounded-md border border-v1-contrast"
        style={{
          backgroundImage:
            "linear-gradient(-38.4355deg, rgba(2, 2, 2, 0) 1.4608%, rgb(33, 33, 33) 50.427%)",
        }}
      >
        {/* Column headers */}
        <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] items-end gap-x-4 border-b border-v1-contrast px-4 py-2 sm:px-5">
          <span className="text-[11px] uppercase tracking-[0.04em] text-v1-frost/60">
            Resource
          </span>
          <span className="text-right text-[11px] uppercase tracking-[0.04em] text-v1-frost/60">
            Per second
          </span>
          <span className="text-right text-[11px] uppercase tracking-[0.04em] text-v1-frost/60">
            Per hour
          </span>
        </div>

        {/* Base rates */}
        {RATE_ROWS.map((row) => (
          <div
            key={row.key}
            className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-4 border-b border-v1-strong/[0.4] px-4 py-2.5 sm:px-5"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="hidden size-7 shrink-0 items-center justify-center rounded border border-v1-strong/[0.4] bg-v1-surfaceElevated text-v1-frost sm:flex">
                {row.icon}
              </span>
              <div className="flex min-w-0 items-baseline gap-2">
                <span className="text-v1-body-sm text-v1-frost">
                  {row.unit}
                </span>
                <span className="text-v1-body-xs text-v1-frost/50">
                  {row.label}
                </span>
              </div>
            </div>
            <span className="text-right font-v1Mono text-[12px] leading-[1.4] tabular-nums text-v1-frost/80">
              {usd(row.rate.perSecond, 6)}
            </span>
            <span className="text-right font-v1Mono text-[12px] leading-[1.4] tabular-nums text-v1-frost/80">
              {usd(row.rate.perHour, 4)}
            </span>
          </div>
        ))}

        {/* Example sizes disclosure */}
        <button
          type="button"
          onClick={() => setShowSizes((v) => !v)}
          aria-expanded={showSizes}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-4 px-4 py-2 text-left outline-none motion-safe:transition-colors hover:bg-v1-frost/[0.03] focus-visible:bg-v1-frost/[0.05] sm:px-5"
        >
          <span className="flex items-center gap-1.5">
            <Chevron isOpen={showSizes} />
            <span className="text-v1-body-xs text-v1-frost/80">
              {showSizes ? "Hide example sizes" : "Show example sizes"}
            </span>
          </span>
          <span className="hidden text-[12px] text-v1-frost/50 sm:inline">
            1–16 vCPU · 1–128 GB RAM
          </span>
        </button>

        <div
          id={panelId}
          role="region"
          aria-label="Example sandbox sizes"
          className={cn(
            "grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-300",
            showSizes ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="border-t border-v1-contrast">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <caption className="sr-only">
                    Hourly cost by vCPU count and memory per vCPU
                  </caption>
                  <thead>
                    <tr className="border-b border-v1-strong/[0.4]">
                      <th
                        scope="col"
                        className="py-2 pl-4 pr-3 text-[11px] font-normal uppercase tracking-[0.04em] text-v1-frost/60 sm:pl-5"
                      >
                        vCPU
                      </th>
                      {RAM_RATIOS.map((r) => (
                        <th
                          key={r}
                          scope="col"
                          className="px-3 py-2 text-right text-[11px] font-normal uppercase tracking-[0.04em] text-v1-frost/60 last:pr-4 sm:last:pr-5"
                        >
                          {r} GB / vCPU
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CPU_SIZES.map((cpu) => (
                      <tr
                        key={cpu}
                        className="border-b border-v1-strong/[0.25] last:border-b-0 motion-safe:transition-colors hover:bg-v1-frost/[0.03]"
                      >
                        <th
                          scope="row"
                          className="py-2 pl-4 pr-3 font-normal sm:pl-5"
                        >
                          <span className="text-v1-body-xs text-v1-frost">
                            {cpu}
                          </span>
                          <span className="ml-1 text-v1-body-xs text-v1-frost/50">
                            vCPU
                          </span>
                        </th>
                        {RAM_RATIOS.map((r) => {
                          const gb = cpu * r;
                          return (
                            <td
                              key={r}
                              className="px-3 py-2 text-right last:pr-4 sm:last:pr-5"
                            >
                              <div className="flex items-baseline justify-end gap-2">
                                <span className="text-[12px] text-v1-frost/50">
                                  {gb} GB
                                </span>
                                <span className="font-v1Mono text-[12px] tabular-nums text-v1-frost">
                                  {usd(hourlyCost(cpu, gb), 4)}
                                  <span className="text-v1-frost/50">/hr</span>
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.p
        {...reveals.body}
        className="text-[12px] leading-[1.5] text-v1-frost/50"
      >
        vCPUs are available in powers of two: 1, 2, 4, 8, or 16. Each vCPU can
        be paired with 1, 2, 4, or 8 GB of RAM (e.g. 2 vCPU with 2, 4, 8, or 16
        GB). Usage is billed per second; hourly rates are shown for reference.
      </motion.p>
    </Section>
  );
}

function Chevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "size-4 text-v1-frost/80 motion-safe:transition-transform motion-safe:duration-200",
        isOpen ? "rotate-180" : "",
      )}
      aria-hidden="true"
    >
      <path
        d="M6 10 L12 16 L18 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CpuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <rect x="9.5" y="9.5" width="5" height="5" fill="currentColor" opacity="0.5" />
      <path
        d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MemoryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <rect
        x="3"
        y="7"
        width="18"
        height="9"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M7 10v3M10.5 10v3M14 10v3M17.5 10v3M6 16v2M9 16v2M12 16v2M15 16v2M18 16v2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
