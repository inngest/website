"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";

const INNGEST_LUX = "#78716C";

const PATTERN_COUNT = 90;
const THROTTLE_MS = 16;

type FooterCTABackgroundProps = {
  shouldTrackMouse?: boolean;
};

export default function FooterCTABackground({
  shouldTrackMouse = false,
}: FooterCTABackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const patternRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const parentSectionRef = useRef<HTMLElement | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const [, forceRerender] = useState(0);

  useEffect(() => {
    patternRefs.current = Array(PATTERN_COUNT).fill(null);

    if (containerRef.current) {
      const section = containerRef.current.closest("section");
      parentSectionRef.current = section;
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
        const newPosition = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };

        setMousePosition(newPosition);
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

  const isInViewport = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= windowHeight && rect.bottom >= 0;
  };

  const setPatternRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      patternRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    forceRerender((v) => v + 1);
  }, []);

  const patterns = useMemo(() => {
    return Array.from({ length: PATTERN_COUNT }).map((_, i) => ({
      id: `pattern-${i}`,
      index: i,
      key: i,
    }));
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <div className="grid grid-cols-10 grid-rows-10 gap-y-2">
        {patterns.map((pattern) => (
          <div
            key={pattern.key}
            ref={setPatternRef(pattern.index)}
            className="relative flex items-center justify-center"
          >
            <BackgroundPattern
              id={pattern.id}
              mousePosition={mousePosition}
              patternRef={patternRefs.current[pattern.index]}
              parentSection={parentSectionRef.current}
              isInViewport={isInViewport}
              index={pattern.index}
              shouldTrackMouse={shouldTrackMouse}
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
  index: number;
  shouldTrackMouse: boolean;
};

const BackgroundPattern = React.memo(function BackgroundPattern({
  id,
  mousePosition,
  patternRef,
  parentSection,
  isInViewport,
  index,
  shouldTrackMouse,
}: BackgroundPatternProps) {
  const inViewport = useMemo(() => {
    if (!patternRef) return false;
    return isInViewport(patternRef);
  }, [patternRef, isInViewport]);

  const initialAngle = useMemo(() => {
    const PRIME = 997;
    return (index * PRIME) % 360;
  }, [index]);

  const angle = useMemo(() => {
    if (!shouldTrackMouse || !patternRef || !parentSection || !inViewport)
      return initialAngle;

    const rect = patternRef.getBoundingClientRect();
    const sectionRect = parentSection.getBoundingClientRect();

    const elementX = rect.left - sectionRect.left + rect.width / 2;
    const elementY = rect.top - sectionRect.top + rect.height / 2;

    const deltaX = mousePosition.x - elementX;
    const deltaY = mousePosition.y - elementY;
    const angleRad = Math.atan2(deltaY, deltaX);

    const angleDeg = (angleRad * 180) / Math.PI + 45;

    return angleDeg;
  }, [
    shouldTrackMouse,
    mousePosition.x,
    mousePosition.y,
    patternRef,
    parentSection,
    inViewport,
    initialAngle,
  ]);

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
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      style={{
        transform: `rotate(${angle}deg)`,
        transformOrigin: "center",
        transition:
          shouldTrackMouse && inViewport ? "transform 0.1s ease-out" : "none",
        willChange: shouldTrackMouse && inViewport ? "transform" : "auto",
      }}
    >
      <g transform="rotate(90 18 18)">
        <path
          d="M5.27222 5.27246L30.7281 30.7283"
          stroke={color}
          strokeWidth="1.5"
          style={{ transition: inViewport ? "stroke 0.2s ease-out" : "none" }}
        />
      </g>
    </svg>
  );
});
