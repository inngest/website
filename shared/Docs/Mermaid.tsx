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
        const c = dark
          ? {
              surface: "#0a0a0a",
              node: "#151515",
              nodeBorder: "#3a3a3a",
              text: "#ededed",
              muted: "#a3a3a3",
              line: "#6b6b6b",
              cluster: "#101010",
              clusterText: "#8a8a8a",
              clusterBorder: "#2e2e2e",
              accentFill: "#0b2a1b",
              accentStroke: "#3fa46d",
              accentText: "#b9ebcb",
              infoFill: "#0d2140",
              infoStroke: "#5a9cf0",
              infoText: "#c4ddff",
              warnFill: "#2e2208",
              warnStroke: "#d4a03a",
              warnText: "#f5dfb0",
            }
          : {
              surface: "#ffffff",
              node: "#ffffff",
              nodeBorder: "#d4d4d4",
              text: "#1f1f1f",
              muted: "#6b6b6b",
              line: "#a3a3a3",
              cluster: "#fafafa",
              clusterText: "#8f8f8f",
              clusterBorder: "#e5e5e5",
              accentFill: "#f0faf4",
              accentStroke: "#2f9e62",
              accentText: "#0c4a2a",
              infoFill: "#f0f6ff",
              infoStroke: "#4a8be8",
              infoText: "#143d80",
              warnFill: "#fff8eb",
              warnStroke: "#d99a26",
              warnText: "#6b4506",
            };
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          // "classic" gives crisp shapes; the "neo" look adds drop shadows.
          look: "classic",
          themeVariables: {
            fontFamily:
              'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: "14px",
            primaryColor: c.node,
            primaryTextColor: c.text,
            primaryBorderColor: c.nodeBorder,
            lineColor: c.line,
            background: "transparent",
            clusterBkg: c.cluster,
            clusterBorder: c.clusterBorder,
            titleColor: c.muted,
            edgeLabelBackground: c.surface,
          },
          themeCSS: `
            .node rect, .node polygon, .node circle, .node path { stroke-width: 1px; filter: none !important; }
            .node, .node *, .cluster, .cluster *, .label-container, .outer-path { filter: none !important; }
            .node rect { rx: 8px; ry: 8px; }
            .node .label, .nodeLabel { font-weight: 500; letter-spacing: -0.005em; }
            .cluster rect { rx: 12px; ry: 12px; stroke-dasharray: 0; }
            .cluster .nodeLabel, .cluster-label .nodeLabel, .cluster text {
              font-size: 12px; font-weight: 500; letter-spacing: 0;
              fill: ${c.clusterText}; color: ${c.clusterText};
            }; color: ${c.muted};
            }
            .flowchart-link { stroke-width: 1.25px; }
            .edgeLabel, .edgeLabel p, .edgeLabel span {
              font-size: 12px; font-weight: 500; color: ${c.muted};
              background-color: ${c.surface};
            }
            .edgeLabel rect { fill: ${c.surface}; opacity: 1; }
            marker path { stroke: none; fill: ${c.line}; }
          `,
          flowchart: {
            curve: "basis",
            nodeSpacing: 32,
            rankSpacing: 30,
            padding: 12,
            diagramPadding: 8,
            wrappingWidth: 240,
            htmlLabels: true,
            subGraphTitleMargin: { top: 6, bottom: 10 },
          },
        });
        // Semantic classes available to every flowchart:
        //   accent  – Inngest-run work (green)
        //   info    – product features inside the run, e.g. Sandbox (blue)
        //   warn    – failures and retries (amber)
        //   muted   – external actors, events, and clients (dashed)
        const themedChart = /^(?:flowchart|graph)\b/.test(chart.trimStart())
          ? `${chart}
classDef accent fill:${c.accentFill},stroke:${c.accentStroke},color:${c.accentText},stroke-width:1.25px
classDef info fill:${c.infoFill},stroke:${c.infoStroke},color:${c.infoText},stroke-width:1.25px
classDef warn fill:${c.warnFill},stroke:${c.warnStroke},color:${c.warnText},stroke-width:1.25px
classDef muted fill:${c.surface},stroke:${c.nodeBorder},color:${c.muted},stroke-width:1px,stroke-dasharray:4 3`
          : chart;
        const { svg: rendered } = await mermaid.render(
          `docs-mermaid-${++nextDiagramId}`,
          themedChart
        );
        if (active) {
          setSvg(alignClusterLabels(rendered));
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
      className={`not-prose mx-auto my-8 w-full overflow-x-auto rounded-xl border border-carbon-200 p-6 dark:border-carbon-800 sm:p-8 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full ${
        wide ? "" : "max-w-[600px]"
      }`}
      style={{ backgroundColor: dark ? "#0a0a0a" : "#ffffff" }}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
}

// Mermaid centers subgraph titles, where edges entering the subgraph cross
// them. Move each title to the top-left corner with comfortable padding.
function alignClusterLabels(svg: string) {
  if (typeof DOMParser === "undefined" || !svg.includes('class="cluster')) {
    return svg;
  }
  // Parse as HTML: labels contain HTML (such as <br>) that strict XML rejects.
  const doc = new DOMParser().parseFromString(svg, "text/html");
  const root = doc.querySelector("svg");
  if (!root) return svg;
  root.querySelectorAll("g.cluster").forEach((cluster) => {
    const rect = cluster.querySelector("rect");
    const label = cluster.querySelector(".cluster-label");
    if (!rect || !label) return;
    const x = parseFloat(rect.getAttribute("x") || "0");
    const y = parseFloat(rect.getAttribute("y") || "0");
    label.setAttribute("transform", `translate(${x + 16}, ${y + 12})`);
  });
  return root.outerHTML;
}
