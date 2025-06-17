"use client";
import { useState, useLayoutEffect, useRef } from "react";

export interface Point {
  x: number;
  y: number;
}

interface LineData {
  /** SVG path string */
  path: string;
  /** Random point on the path for glow dot */
  dotPos: Point | null;
}

export interface FeatureNavigatePaths {
  /** Lines that are only shown on desktop (xl breakpoint and up) */
  desktopLines: LineData[];
  /** Single vertical line for mobile */
  mobileLine: LineData | null;
}

/**
 * Calculates all the dynamic connector lines for the FeatureNavigate section.
 */
export function useFeatureNavigatePaths(): FeatureNavigatePaths {
  const [desktopLines, setDesktopLines] = useState<LineData[]>([
    { path: "", dotPos: null },
    { path: "", dotPos: null },
    { path: "", dotPos: null },
    { path: "", dotPos: null },
    { path: "", dotPos: null },
  ]);
  const [mobileLine, setMobileLine] = useState<LineData | null>(null);

  // Stable random numbers – 5 for desktop + 1 for mobile
  const randomsRef = useRef([...Array(6)].map(() => Math.random()));

  useLayoutEffect(() => {
    const calcPaths = () => {
      const containerEl = document.querySelector(
        ".feature-nav-container"
      ) as HTMLElement | null;
      if (!containerEl) return;
      const containerRect = containerEl.getBoundingClientRect();

      // ----------------- Mobile line -----------------
      const h1El = document.querySelector(
        ".feature-h1-anchor"
      ) as HTMLElement | null;
      const observEl = document.querySelector(
        ".observability-anchor"
      ) as HTMLElement | null;

      if (h1El && observEl) {
        const h1Rect = h1El.getBoundingClientRect();
        const observRect = observEl.getBoundingClientRect();

        const startXM = h1Rect.left + h1Rect.width / 6 - containerRect.left;
        const startYM = h1Rect.bottom - containerRect.top;

        const endXM = startXM;
        const endYM = observRect.top - containerRect.top;

        const mPath = `M ${startXM} ${startYM} L ${endXM} ${endYM}`;
        const mobilePathEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        mobilePathEl.setAttribute("d", mPath);
        const lenM = mobilePathEl.getTotalLength();
        const pointM = mobilePathEl.getPointAtLength(
          lenM * randomsRef.current[5]
        );

        setMobileLine({ path: mPath, dotPos: { x: pointM.x, y: pointM.y } });
      }

      // ----------------- Desktop lines -----------------
      const codeEl = document.querySelector(
        ".code-block-anchor"
      ) as HTMLElement | null;
      const termEl = document.querySelector(
        ".terminal-anchor"
      ) as HTMLElement | null;
      const devEl = document.querySelector(
        ".devserver-anchor"
      ) as HTMLElement | null;
      const devSvgEl = document.querySelector(
        ".devsvg-anchor"
      ) as HTMLElement | null;
      const deployEl = document.querySelector(
        ".deploy-anchor"
      ) as HTMLElement | null;
      const faultEl = document.querySelector(
        ".faulttolerance-anchor"
      ) as HTMLElement | null;
      const observDesktopEl = document.querySelector(
        ".observability-anchor"
      ) as HTMLElement | null;
      const svgExists =
        codeEl &&
        termEl &&
        devEl &&
        devSvgEl &&
        deployEl &&
        faultEl &&
        observDesktopEl;
      if (!svgExists) return;

      const codeRect = codeEl!.getBoundingClientRect();
      const termRect = termEl!.getBoundingClientRect();
      const devRect = devEl!.getBoundingClientRect();
      const devSvgRect = devSvgEl!.getBoundingClientRect();
      const deployRect = deployEl!.getBoundingClientRect();
      const faultRect = faultEl!.getBoundingClientRect();
      const observRect = observDesktopEl!.getBoundingClientRect();

      // Helper to compute dot position given a path
      const makeLine = (path: string, randomIdx: number): LineData => {
        const tempPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        tempPath.setAttribute("d", path);
        const len = tempPath.getTotalLength();
        const point = tempPath.getPointAtLength(
          len * randomsRef.current[randomIdx]
        );
        return { path, dotPos: { x: point.x, y: point.y } };
      };

      // 1. Code block → Terminal (┓)
      const startX = codeRect.left + codeRect.width * 0.25 - containerRect.left;
      const startY = codeRect.bottom - containerRect.top;
      const endX = termRect.left - containerRect.left;
      const endY = termRect.top + termRect.height / 2 - containerRect.top;
      const path1 = `M ${startX} ${startY} L ${startX} ${endY} L ${endX} ${endY}`;

      // 2. Terminal → Dev server (┫)
      const startX2 = termRect.right - containerRect.left;
      const startY2 = endY;
      const endX2 =
        devSvgRect.left + devSvgRect.width / 2.41 - containerRect.left;
      const endY2 = devRect.top - containerRect.top;
      const path2 = `M ${startX2} ${startY2} L ${endX2} ${startY2} L ${endX2} ${endY2}`;

      // 3. Dev SVG bottom → Deploy (vertical)
      const startX3 = endX2; // same as endX2
      const startY3 = devSvgRect.bottom - containerRect.top;
      const endX3 = startX3;
      const endY3 = deployRect.bottom - containerRect.top - 68;
      const path3 = `M ${startX3} ${startY3} L ${startX3} ${endY3} L ${endX3} ${endY3}`;

      // 4. Fault tolerance → Observability (┏)
      const startX4 =
        faultRect.right - faultRect.width / 4 - containerRect.left;
      const startY4 = faultRect.bottom - containerRect.top;
      const endX4 = observRect.left - containerRect.left;
      const endY4 = observRect.top + observRect.height / 2 - containerRect.top;
      const path4 = `M ${startX4} ${startY4} L ${startX4} ${endY4} L ${endX4} ${endY4}`;

      // 5. Deploy → Fault tolerance (З shaped)
      const startX5 = startX3; // same horizontal position as startX3
      const startY5 = deployRect.bottom - containerRect.top;
      const endX5 = startX4; // same as startX4 (left of fault svg)
      const endY5 = faultRect.top - containerRect.top;
      const midY5 = startY5 + (endY5 - startY5) * 0.3;
      const path5 = `M ${startX5} ${startY5} L ${startX5} ${midY5} L ${endX5} ${midY5} L ${endX5} ${endY5}`;

      setDesktopLines([
        makeLine(path1, 0),
        makeLine(path2, 1),
        makeLine(path3, 2),
        makeLine(path4, 3),
        makeLine(path5, 4),
      ]);
    };

    // Initial calc
    calcPaths();

    // Recalc on resize
    window.addEventListener("resize", calcPaths);

    // Observe key elements for size changes
    const ro = new ResizeObserver(calcPaths);
    [
      ".code-block-anchor",
      ".terminal-anchor",
      ".devserver-anchor",
      ".devsvg-anchor",
      ".deploy-anchor",
      ".faulttolerance-anchor",
      ".observability-anchor",
      ".feature-h1-anchor",
    ].forEach((selector) => {
      const el = document.querySelector(selector) as HTMLElement | null;
      if (el) ro.observe(el);
    });

    return () => {
      window.removeEventListener("resize", calcPaths);
      ro.disconnect();
    };
  }, []);

  return { desktopLines, mobileLine };
}
