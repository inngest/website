"use client";
import { useState, useLayoutEffect, useRef } from "react";
import type { Point } from "./useFeatureNavigatePaths";

interface LineData {
  path: string;
  dotPos: Point | null;
}

export interface FeatureNavigatePathsMedium {
  desktopLines: LineData[];
  mobileLine: LineData | null;
}

export function useFeatureNavigatePathsMedium(): FeatureNavigatePathsMedium {
  const [mediumLines, setMediumLines] = useState<LineData[]>([
    { path: "", dotPos: null },
    { path: "", dotPos: null },
    { path: "", dotPos: null },
    { path: "", dotPos: null },
    { path: "", dotPos: null },
  ]);
  const [mobileLine, setMobileLine] = useState<LineData | null>(null);

  const randomsRef = useRef([...Array(6)].map(() => Math.random()));

  useLayoutEffect(() => {
    const calcPaths = () => {
      const containerEl = document.querySelector(
        ".feature-nav-container"
      ) as HTMLElement | null;
      if (!containerEl) return;
      const containerRect = containerEl.getBoundingClientRect();

      // ---- Mobile path identical to desktop hook ----
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

        const tempPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        tempPath.setAttribute("d", mPath);
        const len = tempPath.getTotalLength();
        const point = tempPath.getPointAtLength(len * randomsRef.current[5]);
        setMobileLine({ path: mPath, dotPos: { x: point.x, y: point.y } });
      }

      // ---------- Medium specific lines ----------
      const cardEl = document.querySelector(
        ".code-card-anchor"
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
      const devCardEl = document.querySelector(
        ".dev-card-anchor"
      ) as HTMLElement | null;
      const deployEl = document.querySelector(
        ".deploy-anchor"
      ) as HTMLElement | null;
      const faultEl = document.querySelector(
        ".faulttolerance-anchor"
      ) as HTMLElement | null;
      const observElDesktop = document.querySelector(
        ".observability-anchor"
      ) as HTMLElement | null;

      if (
        !cardEl ||
        !termEl ||
        !devEl ||
        !devSvgEl ||
        !devCardEl ||
        !deployEl ||
        !faultEl ||
        !observElDesktop
      )
        return;

      const cardRect = cardEl.getBoundingClientRect();
      const termRect = termEl.getBoundingClientRect();
      const devRect = devEl.getBoundingClientRect();
      const devSvgRect = devSvgEl.getBoundingClientRect();
      const devCardRect = devCardEl.getBoundingClientRect();
      const deployRect = deployEl.getBoundingClientRect();
      const faultRect = faultEl.getBoundingClientRect();
      const observRect = observElDesktop.getBoundingClientRect();

      const makeLine = (path: string, idx: number): LineData => {
        const p = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        p.setAttribute("d", path);
        const len = p.getTotalLength();
        const point = p.getPointAtLength(len * randomsRef.current[idx]);
        return { path, dotPos: { x: point.x, y: point.y } };
      };

      // 1. Code card -> Terminal (┓)
      const startX1 =
        cardRect.left + cardRect.width * 0.25 - containerRect.left;
      const startY1 = cardRect.bottom - containerRect.top;
      const endX1 = termRect.left - containerRect.left;
      const endY1 = termRect.top + termRect.height / 2 - containerRect.top;
      const path1 = `M ${startX1} ${startY1} L ${startX1} ${endY1} L ${endX1} ${endY1}`;

      // 3. Dev svg bottom -> Deploy (vertical)  (note: original medium file labeled path3)
      const startX3 =
        devSvgRect.left + devSvgRect.width / 2.41 - containerRect.left;
      const startY3 = devCardRect.bottom - containerRect.top;
      const endY3 = deployRect.bottom - containerRect.top - 68;
      const path3 = `M ${startX3} ${startY3} L ${startX3} ${endY3} L ${startX3} ${endY3}`;

      // 2. Terminal bottom -> Dev server top (vertical)
      const startX2 = startX3;
      const startY2 = termRect.bottom - containerRect.top;
      const endY2 = devRect.top - containerRect.top;
      const path2 = `M ${startX2} ${startY2} L ${startX2} ${endY2}`;

      // 5. Deploy -> Fault tolerance (З)
      const startX5 = startX3;
      const startY5 = deployRect.bottom - containerRect.top;
      const endX5 = faultRect.left + faultRect.width / 4 - containerRect.left;
      const endY5 = faultRect.top - containerRect.top;
      const midY5 = startY5 + (endY5 - startY5) * 0.3;
      const path5 = `M ${startX5} ${startY5} L ${startX5} ${midY5} L ${endX5} ${midY5} L ${endX5} ${endY5}`;

      // 4. Fault tolerance bottom-left -> Observability mid-left (┏)
      const startX4 = endX5;
      const startY4 = faultRect.bottom - containerRect.top - 20;
      const endX4 = observRect.left - containerRect.left;
      const endY4 = observRect.top + observRect.height / 2 - containerRect.top;
      const path4 = `M ${startX4} ${startY4} L ${startX4} ${endY4} L ${endX4} ${endY4}`;

      setMediumLines([
        makeLine(path1, 0),
        makeLine(path2, 1),
        makeLine(path3, 2),
        makeLine(path4, 3),
        makeLine(path5, 4),
      ]);
    };

    calcPaths();
    window.addEventListener("resize", calcPaths);

    const ro = new ResizeObserver(calcPaths);
    [
      ".code-card-anchor",
      ".terminal-anchor",
      ".devserver-anchor",
      ".devsvg-anchor",
      ".dev-card-anchor",
      ".deploy-anchor",
      ".faulttolerance-anchor",
      ".observability-anchor",
      ".feature-h1-anchor",
    ].forEach((sel) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) ro.observe(el);
    });

    return () => {
      window.removeEventListener("resize", calcPaths);
      ro.disconnect();
    };
  }, []);

  return { desktopLines: mediumLines, mobileLine };
}
