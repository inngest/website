"use client";

import { useEffect, useRef, useState } from "react";

export function ParallaxCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08, rootMargin: "-60px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className="flex flex-col gap-4 rounded-2xl border border-white/5 p-6 md:p-8"
      style={{
        background: "rgba(33, 33, 33, 0.98)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.05}s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.05}s`,
      }}
    >
      {children}
    </li>
  );
}
