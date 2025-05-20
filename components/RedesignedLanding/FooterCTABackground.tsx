"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";

const INNGEST_LUX = "#ad8513";

const PATTERN_COUNT = 60;
const THROTTLE_MS = 16;

export default function FooterCTABackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const patternRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const parentSectionRef = useRef<HTMLElement | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    patternRefs.current = Array(PATTERN_COUNT).fill(null);
    if (containerRef.current) {
      parentSectionRef.current = containerRef.current.closest("section");
    }
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const now = Date.now();
    if (now - lastUpdateRef.current < THROTTLE_MS) return;
    lastUpdateRef.current = now;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const section = parentSectionRef.current;

      if (section) {
        const rect = section.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    });
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  const isInViewport = useCallback((element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }, []);

  const setPatternRef = (index: number) => (el: HTMLDivElement | null) => {
    patternRefs.current[index] = el;
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <div className="grid grid-cols-10 gap-y-6">
        {Array.from({ length: PATTERN_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={setPatternRef(i)}
            className="relative flex items-center justify-center"
          >
            <BackgroundPattern
              id={`pattern-${i}`}
              mousePosition={mousePosition}
              patternRef={patternRefs.current[i]}
              parentSection={parentSectionRef.current}
              isInViewport={isInViewport}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

type BackgroundPatternProps = {
  id: string;
  mousePosition: { x: number; y: number };
  patternRef: HTMLDivElement | null;
  parentSection: HTMLElement | null;
  isInViewport: (element: HTMLElement) => boolean;
};

function BackgroundPattern({
  id,
  mousePosition,
  patternRef,
  parentSection,
  isInViewport,
}: BackgroundPatternProps) {
  const inViewport = useMemo(() => {
    if (!patternRef) return false;
    return isInViewport(patternRef);
  }, [patternRef, isInViewport]);

  const angle = useMemo(() => {
    if (!patternRef || !parentSection || !inViewport) return 0;

    const rect = patternRef.getBoundingClientRect();
    const sectionRect = parentSection.getBoundingClientRect();

    const elementX = rect.left - sectionRect.left + rect.width / 2;
    const elementY = rect.top - sectionRect.top + rect.height / 2;

    const deltaX = mousePosition.x - elementX;
    const deltaY = mousePosition.y - elementY;
    const angleRad = Math.atan2(deltaY, deltaX);

    const angleDeg = (angleRad * 180) / Math.PI + 45;

    return angleDeg;
  }, [mousePosition.x, mousePosition.y, patternRef, parentSection, inViewport]);

  const color = useMemo(() => {
    if (!inViewport) return "#57534E";
    const normalizedAngle = ((angle % 360) + 360) % 360;

    const r = parseInt(INNGEST_LUX.slice(1, 3), 16);
    const g = parseInt(INNGEST_LUX.slice(3, 5), 16);
    const b = parseInt(INNGEST_LUX.slice(5, 7), 16);

    const brightnessFactor =
      0.7 + (Math.sin((normalizedAngle * Math.PI) / 180) + 1) * 0.3;

    const newR = Math.min(255, Math.max(0, Math.round(r * brightnessFactor)));
    const newG = Math.min(255, Math.max(0, Math.round(g * brightnessFactor)));
    const newB = Math.min(255, Math.max(0, Math.round(b * brightnessFactor)));

    return `rgb(${newR}, ${newG}, ${newB})`;
  }, [angle, inViewport]);

  return (
    <svg
      width="47"
      height="47"
      viewBox="0 0 47 47"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: inViewport ? `rotate(${angle}deg)` : "none",
        transformOrigin: "center",
        transition: inViewport ? "transform 0.1s ease-out" : "none",
        willChange: inViewport ? "transform" : "auto",
      }}
    >
      <mask id={`path-1-inside-1_${id}`} fill="white">
        <path d="M0.770996 27.6587L27.9716 46.3436L46.6565 19.143L19.4559 0.458082L0.770996 27.6587Z" />
      </mask>
      <path
        d="M27.9716 46.3436L27.1473 45.7774L45.8323 18.5768L46.6565 19.143L47.4808 19.7092L28.7959 46.9098L27.9716 46.3436ZM19.4559 0.458082L20.2802 1.02429L1.59526 28.2249L0.770996 27.6587L-0.0532648 27.0925L18.6317 -0.108128L19.4559 0.458082Z"
        fill={color}
        mask={`url(#path-1-inside-1_${id})`}
        style={{ transition: inViewport ? "fill 0.2s ease-out" : "none" }}
      />
    </svg>
  );
}
