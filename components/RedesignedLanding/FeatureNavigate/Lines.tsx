"use client";
import { useState, useLayoutEffect, useRef } from "react";
import { motion } from "motion/react";
export default function Lines() {
  const svgRef = useRef(null);
  const [dynamicPath, setDynamicPath] = useState("");
  const [dynamicPath2, setDynamicPath2] = useState("");
  const [dynamicPath3, setDynamicPath3] = useState("");
  const [dynamicPath4, setDynamicPath4] = useState("");
  const [dynamicPath5, setDynamicPath5] = useState("");
  // Path for mobile (<sm) connecting h1 to observability graphic
  const [dynamicMobilePath, setDynamicMobilePath] = useState("");
  const [dotPos1, setDotPos1] = useState<{ x: number; y: number } | null>(null);
  const [dotPos2, setDotPos2] = useState<{ x: number; y: number } | null>(null);
  const [dotPos3, setDotPos3] = useState<{ x: number; y: number } | null>(null);
  const [dotPos4, setDotPos4] = useState<{ x: number; y: number } | null>(null);
  const [dotPos5, setDotPos5] = useState<{ x: number; y: number } | null>(null);
  const [dotPosMobile, setDotPosMobile] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Random positions along each path (stable across renders)
  const randRef1 = useRef(Math.random());
  const randRef2 = useRef(Math.random());
  const randRef3 = useRef(Math.random());
  const randRef4 = useRef(Math.random());
  const randRef5 = useRef(Math.random());
  const randRefMobile = useRef(Math.random());

  useLayoutEffect(() => {
    const calcPath = () => {
      // Container is the main feature navigate wrapper.
      const containerEl = document.querySelector(
        ".feature-nav-container"
      ) as HTMLElement | null;
      if (!containerEl) return;
      const containerRect = containerEl.getBoundingClientRect();

      // --- Mobile-only path (calculated first so we don't bail early) ---
      const h1El = document.querySelector(
        ".feature-h1-anchor"
      ) as HTMLElement | null;
      const observEl = document.querySelector(
        ".observability-anchor"
      ) as HTMLElement | null;

      if (h1El && observEl) {
        const h1Rect = h1El.getBoundingClientRect();
        const observRect = observEl.getBoundingClientRect();

        // Position: 1/6 in from the left edge of the headline
        const startXM = h1Rect.left + h1Rect.width / 6 - containerRect.left;
        const startYM = h1Rect.bottom - containerRect.top;

        const endXM = startXM;
        const endYM = observRect.top - containerRect.top;

        const mPath = `M ${startXM} ${startYM} L ${endXM} ${endYM}`;
        setDynamicMobilePath(mPath);
        // Glow dot for mobile path
        const tempPathM = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        tempPathM.setAttribute("d", mPath);
        const lenM = tempPathM.getTotalLength();
        const pointM = tempPathM.getPointAtLength(lenM * randRefMobile.current);
        setDotPosMobile({ x: pointM.x, y: pointM.y });
      }

      const codeEl = document.querySelector(
        ".code-block-anchor"
      ) as HTMLElement | null;
      const termEl = document.querySelector(
        ".terminal-anchor"
      ) as HTMLElement | null;
      const svgEl = svgRef.current as SVGSVGElement | null;

      if (!codeEl || !termEl || !svgEl) return;

      const codeRect = codeEl.getBoundingClientRect();
      const termRect = termEl.getBoundingClientRect();
      const devEl = document.querySelector(
        ".devserver-anchor"
      ) as HTMLElement | null;
      const devSvgEl = document.querySelector(
        ".devsvg-anchor"
      ) as HTMLElement | null;
      const deployEl = document.querySelector(
        ".deploy-anchor"
      ) as HTMLElement | null;

      if (!devEl || !devSvgEl || !deployEl) return;
      const devRect = devEl.getBoundingClientRect();
      const devSvgRect = devSvgEl.getBoundingClientRect();
      const deployRect = deployEl.getBoundingClientRect();
      const faultEl = document.querySelector(
        ".faulttolerance-anchor"
      ) as HTMLElement | null;

      const observElDesktop = document.querySelector(
        ".observability-anchor"
      ) as HTMLElement | null;

      if (!faultEl || !observElDesktop) return;
      const observRect = observElDesktop.getBoundingClientRect();
      const faultRect = faultEl.getBoundingClientRect();

      // Start: bottom-left of code block
      const startX = codeRect.left + codeRect.width * 0.25 - containerRect.left;
      const startY = codeRect.bottom - containerRect.top; // still bottom

      // End: middle-left of terminal
      const endX = termRect.left - containerRect.left;
      const endY = termRect.top + termRect.height / 2 - containerRect.top;

      // vertical then horizontal (┓ shape)
      const path = `M ${startX} ${startY} L ${startX} ${endY} L ${endX} ${endY}`;
      setDynamicPath(path);
      // Calculate random point for glow dot on first path
      const tempPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      tempPath.setAttribute("d", path);
      const len = tempPath.getTotalLength();
      const point = tempPath.getPointAtLength(len * randRef1.current);
      setDotPos1({ x: point.x, y: point.y });

      // Second path: from terminal to devserver section
      const startX2 = termRect.right - containerRect.left; // terminal right border
      const startY2 = endY; // same y as previous end

      const endX2 =
        devSvgRect.left + devSvgRect.width / 2.41 - containerRect.left;
      const endY2 = devRect.top - containerRect.top;

      const path2 = `M ${startX2} ${startY2} L ${endX2} ${startY2} L ${endX2} ${endY2}`;
      setDynamicPath2(path2);
      // Glow dot for second path
      const tempPath2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      tempPath2.setAttribute("d", path2);
      const len2 = tempPath2.getTotalLength();
      const point2 = tempPath2.getPointAtLength(len2 * randRef2.current);
      setDotPos2({ x: point2.x, y: point2.y });

      // Third path: from bottom-middle of dev svg to top-middle of deploy section
      const startX3 =
        devSvgRect.left + devSvgRect.width / 2.41 - containerRect.left;
      const startY3 = devSvgRect.bottom - containerRect.top;

      //   const endX3 = deployRect.left + deployRect.width / 2 - containerRect.left;
      const endX3 = startX3;
      const endY3 = deployRect.bottom - containerRect.top - 68;

      const path3 = `M ${startX3} ${startY3} L ${startX3} ${endY3} L ${endX3} ${endY3}`;
      setDynamicPath3(path3);
      // Glow dot for third path
      const tempPath3 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      tempPath3.setAttribute("d", path3);
      const len3 = tempPath3.getTotalLength();
      const point3 = tempPath3.getPointAtLength(len3 * randRef3.current);
      setDotPos3({ x: point3.x, y: point3.y });

      // Fourth path: from bottom-right of fault tolerance svg to mid-left of observability svg
      const startX4 =
        faultRect.right - faultRect.width / 4 - containerRect.left;
      const startY4 = faultRect.bottom - containerRect.top;

      const endX4 = observRect.left - containerRect.left;
      const endY4 = observRect.top + observRect.height / 2 - containerRect.top;

      const path4 = `M ${startX4} ${startY4} L ${startX4} ${endY4} L ${endX4} ${endY4}`;
      setDynamicPath4(path4);
      // Glow dot for fourth path
      const tempPath4 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      tempPath4.setAttribute("d", path4);
      const len4 = tempPath4.getTotalLength();
      const point4 = tempPath4.getPointAtLength(len4 * randRef4.current);
      setDotPos4({ x: point4.x, y: point4.y });

      // Fifth path: from bottom-middle of deploy svg to top-middle of fault tolerance svg with two bends
      // const startX5 =
      //   deployRect.left + deployRect.width / 1.61 - containerRect.left;
      const startX5 = startX3;
      const startY5 = deployRect.bottom - containerRect.top;

      const endX5 = faultRect.right - faultRect.width / 4 - containerRect.left;
      const endY5 = faultRect.top - containerRect.top;

      // Create two bends: vertical down some portion, horizontal across, then vertical to end
      const midY5 = startY5 + (endY5 - startY5) * 0.3; // adjust this ratio to tweak bend depth

      const path5 = `M ${startX5} ${startY5} L ${startX5} ${midY5} L ${endX5} ${midY5} L ${endX5} ${endY5}`;
      setDynamicPath5(path5);
      // Glow dot for fifth path
      const tempPath5 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      tempPath5.setAttribute("d", path5);
      const len5 = tempPath5.getTotalLength();
      const point5 = tempPath5.getPointAtLength(len5 * randRef5.current);
      setDotPos5({ x: point5.x, y: point5.y });
    };

    calcPath();

    window.addEventListener("resize", calcPath);
    const ro1 = new ResizeObserver(calcPath);
    const codeEl = document.querySelector(
      ".code-block-anchor"
    ) as HTMLElement | null;
    const termEl = document.querySelector(
      ".terminal-anchor"
    ) as HTMLElement | null;
    const devEl = document.querySelector(
      ".devserver-anchor"
    ) as HTMLElement | null;
    if (codeEl) ro1.observe(codeEl);
    if (termEl) ro1.observe(termEl);
    if (devEl) ro1.observe(devEl);
    const devSvgEl = document.querySelector(
      ".devsvg-anchor"
    ) as HTMLElement | null;
    const deployEl = document.querySelector(
      ".deploy-anchor"
    ) as HTMLElement | null;
    const faultAnchorEl = document.querySelector(
      ".faulttolerance-anchor"
    ) as HTMLElement | null;
    const observAnchorEl = document.querySelector(
      ".observability-anchor"
    ) as HTMLElement | null;
    const cardEl = document.querySelector(
      ".code-block-switcher .mt-8"
    ) as HTMLElement | null;

    if (devSvgEl) ro1.observe(devSvgEl);
    if (deployEl) ro1.observe(deployEl);
    if (faultAnchorEl) ro1.observe(faultAnchorEl);
    if (observAnchorEl) ro1.observe(observAnchorEl);

    const h1ElObs = document.querySelector(
      ".feature-h1-anchor"
    ) as HTMLElement | null;
    if (h1ElObs) ro1.observe(h1ElObs);

    return () => {
      window.removeEventListener("resize", calcPath);
      ro1.disconnect();
    };
  }, []);

  return (
    <>
      {/* Animated line connecting CodeBlockSwitcher and Terminal (dynamic) */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="pointer-events-none absolute left-0 top-0 z-10 hidden xl:block"
      >
        <defs>
          <linearGradient
            id="grad1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#CBB26A" />
            <stop offset="100%" stopColor="#57534E" />
          </linearGradient>
        </defs>
        {/* Animated line from code block bottom (25% from left) to terminal right side */}
        {dynamicPath && (
          <motion.path
            d={dynamicPath}
            stroke="url(#grad1)"
            strokeWidth={1}
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 0.5,
              ease: "easeInOut",
            }}
          />
        )}
      </svg>
      <svg
        width="100%"
        height="100%"
        className="pointer-events-none absolute left-0 top-0 z-10 hidden xl:block"
      >
        <defs>
          <linearGradient
            id="grad2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#CBB26A" />
            <stop offset="100%" stopColor="#57534E" />
          </linearGradient>
        </defs>
        {dynamicPath2 && (
          <motion.path
            d={dynamicPath2}
            stroke="url(#grad2)"
            strokeWidth={1}
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 0.5,
              ease: "easeInOut",
            }}
          />
        )}
      </svg>

      <svg
        width="100%"
        height="100%"
        className="pointer-events-none absolute left-0 top-0 z-10 hidden xl:block"
      >
        <defs>
          <linearGradient
            id="grad3dynamic"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#CBB26A" />
            <stop offset="100%" stopColor="#57534E" />
          </linearGradient>
        </defs>
        {dynamicPath3 && (
          <motion.path
            d={dynamicPath3}
            stroke="url(#grad3dynamic)"
            strokeWidth={1}
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 0.5,
              ease: "easeInOut",
            }}
            className="z-20"
          />
        )}
      </svg>
      <svg
        width="100%"
        height="100%"
        className="pointer-events-none absolute left-0 top-0 z-10 hidden xl:block"
      >
        <defs>
          <linearGradient
            id="grad4dynamic"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#CBB26A" />
            <stop offset="100%" stopColor="#57534E" />
          </linearGradient>
        </defs>
        {dynamicPath4 && (
          <motion.path
            d={dynamicPath4}
            stroke="url(#grad4dynamic)"
            strokeWidth={1}
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 0.5,
              ease: "easeInOut",
            }}
          />
        )}
      </svg>
      <svg
        width="100%"
        height="100%"
        className="pointer-events-none absolute left-0 top-0 z-10 hidden xl:block"
      >
        <defs>
          <linearGradient
            id="grad5dynamic"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#CBB26A" />
            <stop offset="100%" stopColor="#57534E" />
          </linearGradient>
        </defs>
        {dynamicPath5 && (
          <motion.path
            d={dynamicPath5}
            stroke="url(#grad5dynamic)"
            strokeWidth={1}
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 0.5,
              ease: "easeInOut",
            }}
          />
        )}
      </svg>
      {/* Mobile-only vertical line from headline to observability */}
      <svg
        width="100%"
        height="100%"
        className="pointer-events-none absolute left-0 top-0 z-10 block md:hidden"
      >
        <defs>
          <linearGradient
            id="gradMobile"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#CBB26A" />
            <stop offset="100%" stopColor="#57534E" />
          </linearGradient>
        </defs>
        {dynamicMobilePath && (
          <motion.path
            d={dynamicMobilePath}
            stroke="url(#gradMobile)"
            strokeWidth={1}
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              delay: 0.5,
              ease: "easeInOut",
            }}
          />
        )}
      </svg>
      {/* Render Glow Dots for desktop paths */}
      {dotPos1 && (
        <div
          className="pointer-events-none absolute z-20 hidden xl:block"
          style={{
            left: dotPos1.x,
            top: dotPos1.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <GlowDot />
        </div>
      )}
      {dotPos2 && (
        <div
          className="pointer-events-none absolute z-20 hidden xl:block"
          style={{
            left: dotPos2.x,
            top: dotPos2.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <GlowDot />
        </div>
      )}
      {dotPos3 && (
        <div
          className="pointer-events-none absolute z-20 hidden xl:block"
          style={{
            left: dotPos3.x,
            top: dotPos3.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <GlowDot />
        </div>
      )}
      {dotPos4 && (
        <div
          className="pointer-events-none absolute z-20 hidden xl:block"
          style={{
            left: dotPos4.x,
            top: dotPos4.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <GlowDot />
        </div>
      )}
      {dotPos5 && (
        <div
          className="pointer-events-none absolute z-20 hidden xl:block"
          style={{
            left: dotPos5.x,
            top: dotPos5.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <GlowDot />
        </div>
      )}
      {/* Mobile Glow Dot */}
      {dotPosMobile && (
        <div
          className="pointer-events-none absolute z-20 block sm:hidden"
          style={{
            left: dotPosMobile.x,
            top: dotPosMobile.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <GlowDot />
        </div>
      )}
    </>
  );
}

function GlowDot() {
  return (
    <svg
      width="116"
      height="116"
      viewBox="0 0 116 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_ddd_4268_15181)">
        <rect
          width="8"
          height="8"
          transform="matrix(-1 0 0 1 61.7725 53.8804)"
          fill="#EFD27E"
        />
      </g>
      <defs>
        <filter
          id="filter0_ddd_4268_15181"
          x="0.0124626"
          y="0.120373"
          width="115.52"
          height="115.52"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="3"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_4268_15181"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4.45" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.796078 0 0 0 0 0.698039 0 0 0 0 0.415686 0 0 0 0.45 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4268_15181"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="7.68" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.796078 0 0 0 0 0.698039 0 0 0 0 0.415686 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_4268_15181"
            result="effect2_dropShadow_4268_15181"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="26.88" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.796078 0 0 0 0 0.698039 0 0 0 0 0.415686 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_4268_15181"
            result="effect3_dropShadow_4268_15181"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect3_dropShadow_4268_15181"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
