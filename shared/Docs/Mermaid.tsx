"use client";

import { useEffect, useState } from "react";

let nextDiagramId = 0;

export function Mermaid({
  chart,
  label,
  wide = false,
}: {
  chart: string;
  label: string;
  wide?: boolean;
}) {
  const [dark, setDark] = useState(false);
  const [svg, setSvg] = useState<string>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setDark(document.documentElement.classList.contains("dark"));
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            fontFamily:
              'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: "15px",
            primaryColor: dark ? "#121212" : "#ffffff",
            primaryTextColor: dark ? "#f5f5f5" : "#242424",
            primaryBorderColor: dark ? "#4d4d4d" : "#d7d7d7",
            lineColor: dark ? "#9a9a9a" : "#777777",
            background: dark ? "#020202" : "#ffffff",
          },
          flowchart: {
            curve: "basis",
            nodeSpacing: 20,
            rankSpacing: 16,
            padding: 10,
          },
        });
        const themedChart = /^(?:flowchart|graph)\b/.test(chart.trimStart())
          ? `${chart}
classDef accent fill:${dark ? "#015430" : "#eff9f2"},stroke:${
              dark ? "#66bd8b" : "#027a48"
            },color:${dark ? "#f5f5f5" : "#015430"},stroke-width:1.5px
classDef info fill:${dark ? "#134085" : "#eff7ff"},stroke:${
              dark ? "#9cd2ff" : "#1365d6"
            },color:${dark ? "#f5f5f5" : "#1450b1"},stroke-width:1.5px`
          : chart;
        const { svg: rendered } = await mermaid.render(
          `docs-mermaid-${++nextDiagramId}`,
          themedChart
        );
        if (active) {
          setSvg(rendered);
          setFailed(false);
        }
      } catch {
        if (active) setFailed(true);
      }
    }

    render();
    return () => {
      active = false;
    };
  }, [chart, dark]);

  if (failed) {
    return <pre className="overflow-x-auto">{chart}</pre>;
  }

  return (
    <figure
      role="img"
      aria-label={label}
      className={`mx-auto my-8 w-full overflow-x-auto rounded-xl border border-subtle bg-surfaceBase p-6 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full ${
        wide ? "" : "max-w-[520px]"
      }`}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}
