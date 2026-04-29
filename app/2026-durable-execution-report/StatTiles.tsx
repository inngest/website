"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { id: "01", target: 130, suffix: "",  label: "Engineers surveyed" },
  { id: "02", target: 74,  suffix: "%", label: "Had incidents in last 90 days" },
  { id: "03", target: 19,  suffix: "%", label: "Had confidence at scale" },
];

const DURATION = 1400;

function useCountUp(target: number, active: boolean, delay: number) {
  const [value, setValue] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!startTime) startTime = ts;
        const progress = Math.min((ts - startTime) / DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf.current);
    };
  }, [active, target, delay]);

  return value;
}

function Tile({ stat, active, index }: { stat: typeof STATS[0]; active: boolean; index: number }) {
  const count = useCountUp(stat.target, active, index * 120);

  return (
    <div
      className="flex flex-col gap-1.5 rounded-xl p-5"
      style={{
        background: "rgba(168,239,60,0.06)",
        border: "1px solid rgba(168,239,60,0.15)",
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.5s ease ${index * 0.12}s, transform 0.5s ease ${index * 0.12}s`,
      }}
    >
      <span className="font-mono text-xs text-white/30">— {stat.id}</span>
      <span className="font-whyteInktrap text-4xl font-bold leading-none" style={{ color: "#a8ef3c" }}>
        {count}{stat.suffix}
      </span>
      <span className="text-xs font-medium uppercase tracking-wider text-white/50">
        {stat.label}
      </span>
    </div>
  );
}

export function StatTiles() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-3 gap-3">
      {STATS.map((s, i) => (
        <Tile key={s.id} stat={s} active={active} index={i} />
      ))}
    </div>
  );
}
