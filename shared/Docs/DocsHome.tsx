import React from "react";
import clsx from "clsx";
import Link from "next/link";
import {
  RiArrowRightLine,
  RiBarChartBoxLine,
  RiBroadcastLine,
  RiFlowChart,
  RiPulseLine,
  RiSpeedUpLine,
  RiTerminalBoxLine,
} from "@remixicon/react";

import { GridPattern } from "./GridPattern";
import IconTypeScript from "../Icons/TypeScript";
import IconPython from "../Icons/Python";
import IconGo from "../Icons/Go";

/*
 * Components for the docs home page (pages/docs/index.mdx).
 *
 * Illustrations are inline SVG drawn with Tailwind fill/stroke classes so they
 * follow the light and dark themes without separate image assets.
 */

const cardSurface =
  "not-prose group relative overflow-hidden rounded border border-carbon-200 bg-canvasBase transition-colors hover:border-carbon-300 hover:bg-carbon-50/50 dark:border-carbon-700 dark:hover:border-carbon-600 dark:hover:bg-carbon-900";
const cardBase = clsx(cardSurface, "flex h-full flex-col");

const titleClass = "text-base font-semibold text-basis";
const descClass = "mt-1 text-sm text-subtle";

// Shared SVG class names.
const S = {
  surface: "fill-white dark:fill-carbon-900",
  edge: "stroke-carbon-200 dark:stroke-carbon-700",
  line: "fill-carbon-200 dark:fill-carbon-700",
  lineStrong: "fill-carbon-300 dark:fill-carbon-600",
  accent: "fill-matcha-500",
  accentSoft: "fill-matcha-500/20",
  accentStroke: "stroke-matcha-500",
  text: "fill-carbon-500 dark:fill-carbon-400",
};

function Illustration({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative aspect-[2/1] overflow-hidden border-b border-carbon-200 bg-gradient-to-br from-matcha-500/15 via-carbon-50 to-carbon-50 dark:border-carbon-700 dark:from-matcha-500/20 dark:via-carbon-900/60 dark:to-carbon-900/40">
      <GridPattern
        width={20}
        height={20}
        x="-1"
        y="-1"
        className="absolute inset-0 h-full w-full stroke-carbon-200/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] dark:stroke-carbon-700/40"
      />
      <svg
        viewBox="28 14 184 92"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {children}
      </svg>
    </div>
  );
}

function Window({
  x,
  y,
  w,
  h,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: React.ReactNode;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="5"
        className={clsx(S.surface, S.edge)}
      />
      <circle cx={x + 8} cy={y + 8} r="2" className={S.line} />
      <circle cx={x + 15} cy={y + 8} r="2" className={S.line} />
      <circle cx={x + 22} cy={y + 8} r="2" className={S.line} />
      {children}
    </g>
  );
}

function Check({ cx, cy, r = 5 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} className={S.accent} />
      <path
        d={`M${cx - r * 0.45} ${cy}l${r * 0.3} ${r * 0.32} ${r * 0.6}-${
          r * 0.64
        }`}
        className="stroke-white"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

// --- Welcome illustrations -------------------------------------------------

const IllustrationQuickStart = () => (
  <Illustration>
    <Window x={40} y={22} w={160} h={78}>
      <text x={52} y={46} className={clsx(S.text, "font-mono")} fontSize="8">
        $ npx inngest-cli dev
      </text>
      <rect x={52} y={56} width={70} height={4} rx="2" className={S.line} />
      <rect x={52} y={65} width={96} height={4} rx="2" className={S.line} />
      <Check cx={57} cy={83} r={5} />
      <rect
        x={67}
        y={81}
        width={60}
        height={4}
        rx="2"
        className={S.accentSoft}
      />
    </Window>
  </Illustration>
);

const IllustrationPlatform = () => (
  <Illustration>
    <path
      d="M70 60h100"
      className={S.accentStroke}
      strokeWidth="1.5"
      strokeDasharray="3 3"
    />
    {[
      { x: 50, label: "Workflow" },
      { x: 120, label: "Sandbox" },
      { x: 190, label: "Eval" },
    ].map((n, i) => (
      <g key={n.label}>
        <rect
          x={n.x - 22}
          y={42}
          width={44}
          height={36}
          rx="6"
          className={clsx(S.surface, S.edge)}
        />
        <rect
          x={n.x - 12}
          y={52}
          width={24}
          height={4}
          rx="2"
          className={i === 1 ? S.accent : S.lineStrong}
        />
        <rect
          x={n.x - 12}
          y={61}
          width={16}
          height={4}
          rx="2"
          className={S.line}
        />
        <text
          x={n.x}
          y={94}
          textAnchor="middle"
          className={S.text}
          fontSize="8"
        >
          {n.label}
        </text>
      </g>
    ))}
  </Illustration>
);

const IllustrationAgents = () => (
  <Illustration>
    <rect
      x={44}
      y={24}
      width={112}
      height={34}
      rx="8"
      className={clsx(S.surface, S.edge)}
    />
    <rect x={56} y={35} width={70} height={4} rx="2" className={S.lineStrong} />
    <rect x={56} y={44} width={48} height={4} rx="2" className={S.line} />
    <rect
      x={84}
      y={66}
      width={112}
      height={34}
      rx="8"
      className={S.accentSoft}
    />
    <text
      x={96}
      y={80}
      className={clsx("fill-matcha-600 dark:fill-matcha-400", "font-mono")}
      fontSize="8"
    >
      {"step.run(…)"}
    </text>
    <rect x={96} y={87} width={60} height={4} rx="2" className={S.accentSoft} />
    <path
      d="M176 30l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z"
      className={S.accent}
    />
  </Illustration>
);

const IllustrationReference = () => (
  <Illustration>
    <Window x={40} y={22} w={160} h={78}>
      {[
        [52, 38, 20, true],
        [76, 38, 50, false],
        [60, 50, 34, false],
        [98, 50, 44, true],
        [60, 62, 60, false],
        [60, 74, 28, true],
        [92, 74, 40, false],
        [52, 86, 12, false],
      ].map(([x, y, w, accent], i) => (
        <rect
          key={i}
          x={x as number}
          y={y as number}
          width={w as number}
          height={4}
          rx="2"
          className={accent ? S.accent : S.line}
        />
      ))}
    </Window>
  </Illustration>
);

// --- Use-case illustrations ------------------------------------------------

const IllustrationAgentTrace = () => (
  <Illustration>
    <rect
      x={30}
      y={20}
      width={180}
      height={82}
      rx="5"
      className={clsx(S.surface, S.edge)}
    />
    {[
      { y: 32, x: 40, w: 150, label: true },
      { y: 46, x: 48, w: 44, accent: true },
      { y: 60, x: 92, w: 36 },
      { y: 74, x: 128, w: 30, accent: true },
      { y: 88, x: 158, w: 30 },
    ].map((b, i) => (
      <rect
        key={i}
        x={b.x}
        y={b.y}
        width={b.w}
        height={7}
        rx="2"
        className={b.label ? S.lineStrong : b.accent ? S.accent : S.line}
      />
    ))}
  </Illustration>
);

const IllustrationWorkflow = () => (
  <Illustration>
    <path d="M80 30v62" className={S.edge} strokeWidth="1.5" />
    {[30, 51, 72, 93].map((y, i) => (
      <g key={y}>
        {i < 3 ? (
          <Check cx={80} cy={y} r={6} />
        ) : (
          <circle
            cx={80}
            cy={y}
            r={6}
            className={clsx(S.surface, S.edge)}
            strokeWidth="1.5"
          />
        )}
        <rect
          x={94}
          y={y - 5}
          width={i === 1 ? 80 : 64}
          height={10}
          rx="3"
          className={clsx(S.surface, S.edge)}
        />
        <rect
          x={100}
          y={y - 2}
          width={i === 1 ? 36 : 40}
          height={4}
          rx="2"
          className={S.line}
        />
        {i === 1 && (
          <text
            x={142}
            y={y + 2.5}
            className="fill-matcha-600 dark:fill-matcha-400"
            fontSize="7"
          >
            retried
          </text>
        )}
      </g>
    ))}
  </Illustration>
);

const IllustrationSandbox = () => (
  <Illustration>
    <rect
      x={30}
      y={16}
      width={180}
      height={90}
      rx="8"
      className={clsx("fill-none", S.accentStroke)}
      strokeWidth="1.2"
      strokeDasharray="4 3"
    />
    <text
      x={40}
      y={29}
      className="fill-matcha-600 dark:fill-matcha-400"
      fontSize="7"
    >
      microVM
    </text>
    <Window x={46} y={36} w={148} h={60}>
      <text x={58} y={60} className={clsx(S.text, "font-mono")} fontSize="8">
        $ npm test
      </text>
      <rect x={58} y={68} width={90} height={4} rx="2" className={S.line} />
      <rect x={58} y={77} width={52} height={4} rx="2" className={S.accent} />
    </Window>
  </Illustration>
);

const IllustrationEvals = () => (
  <Illustration>
    <path d="M40 98h160" className={S.edge} strokeWidth="1.2" />
    {[
      { x: 62, hA: 34, hB: 52 },
      { x: 112, hA: 44, hB: 62 },
      { x: 162, hA: 28, hB: 48 },
    ].map((g) => (
      <g key={g.x}>
        <rect
          x={g.x}
          y={98 - g.hA}
          width={14}
          height={g.hA}
          rx="2"
          className={S.lineStrong}
        />
        <rect
          x={g.x + 17}
          y={98 - g.hB}
          width={14}
          height={g.hB}
          rx="2"
          className={S.accent}
        />
      </g>
    ))}
    <text x={44} y={24} className={S.text} fontSize="7">
      A
    </text>
    <rect x={52} y={19} width={8} height={6} rx="1" className={S.lineStrong} />
    <text x={68} y={24} className={S.text} fontSize="7">
      B
    </text>
    <rect x={76} y={19} width={8} height={6} rx="1" className={S.accent} />
  </Illustration>
);

// --- Cards -----------------------------------------------------------------

type ImageCardItem = {
  href: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
};

function ImageCard({ href, title, description, illustration }: ImageCardItem) {
  return (
    <Link href={href} className={cardBase}>
      {illustration}
      <div className="p-4">
        <h3 className={titleClass}>{title}</h3>
        <p className={descClass}>{description}</p>
      </div>
    </Link>
  );
}

function ImageCardGrid({ items }: { items: ImageCardItem[] }) {
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <ImageCard key={item.href} {...item} />
      ))}
    </div>
  );
}

export function WelcomeGrid() {
  return (
    <ImageCardGrid
      items={[
        {
          href: "/docs/getting-started?ref=docs-home",
          title: "Quick start",
          description:
            "Run your first durable workflow, Sandbox, eval, or live update.",
          illustration: <IllustrationQuickStart />,
        },
        {
          href: "/docs/platform-overview?ref=docs-home",
          title: "Platform overview",
          description:
            "See how workflows, Sandboxes, and outcome scores fit together.",
          illustration: <IllustrationPlatform />,
        },
        {
          href: "/docs/ai-dev-tools?ref=docs-home",
          title: "Coding agents",
          description:
            "Using a coding agent? Give it skills, MCP, and LLM-ready docs.",
          illustration: <IllustrationAgents />,
        },
        {
          href: "/docs/reference?ref=docs-home",
          title: "SDK reference",
          description: "TypeScript, Python, and Go SDKs, plus the REST API.",
          illustration: <IllustrationReference />,
        },
      ]}
    />
  );
}

export function UseCaseGrid() {
  return (
    <ImageCardGrid
      items={[
        {
          href: "/docs/learn/durable-agents?ref=docs-home",
          title: "AI agents",
          description:
            "Run agent loops that call tools, wait for people, and survive failures.",
          illustration: <IllustrationAgentTrace />,
        },
        {
          href: "/docs/durable-execution/durable-workflows?ref=docs-home",
          title: "Workflows and background jobs",
          description:
            "Run multi-step jobs that retry each failed step, not the whole job.",
          illustration: <IllustrationWorkflow />,
        },
        {
          href: "/docs/sandboxes/guides?ref=docs-home",
          title: "Code execution",
          description:
            "Run generated code and test repositories in isolated microVMs.",
          illustration: <IllustrationSandbox />,
        },
        {
          href: "/docs/online-evals/a-b-testing?ref=docs-home",
          title: "Evals and A/B tests",
          description:
            "Score real outcomes and compare prompts, models, and workflows.",
          illustration: <IllustrationEvals />,
        },
      ]}
    />
  );
}

type IconCardItem = {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

function IconCard({ href, title, description, icon }: IconCardItem) {
  return (
    <Link href={href} className={clsx(cardBase, "p-5")}>
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-matcha-500/10 text-matcha-600 dark:text-matcha-400">
        {icon}
      </div>
      <h3 className={titleClass}>{title}</h3>
      <p className={descClass}>{description}</p>
    </Link>
  );
}

export function PlatformGrid() {
  const items: IconCardItem[] = [
    {
      href: "/docs/durable-execution?ref=docs-home",
      title: "Durable Execution",
      description:
        "Coordinate steps, retries, waits, and events so work finishes after failures.",
      icon: <RiFlowChart className="h-5 w-5" />,
    },
    {
      href: "/docs/sandboxes?ref=docs-home",
      title: "Sandboxes",
      description: "Run code in isolated microVMs as part of a durable run.",
      icon: <RiTerminalBoxLine className="h-5 w-5" />,
    },
    {
      href: "/docs/online-evals?ref=docs-home",
      title: "Online Evals",
      description: "Score outcomes and compare changes to steps and workflows.",
      icon: <RiBarChartBoxLine className="h-5 w-5" />,
    },
    {
      href: "/docs/realtime?ref=docs-home",
      title: "Realtime",
      description: "Stream progress from durable runs to your users.",
      icon: <RiBroadcastLine className="h-5 w-5" />,
    },
    {
      href: "/docs/durable-execution/flow-control?ref=docs-home",
      title: "Flow control",
      description:
        "Control concurrency, throughput, and fairness across tenants.",
      icon: <RiSpeedUpLine className="h-5 w-5" />,
    },
    {
      href: "/docs/platform-and-operations?ref=docs-home",
      title: "Observability",
      description:
        "Inspect traces, replay runs, and track metrics in production.",
      icon: <RiPulseLine className="h-5 w-5" />,
    },
  ];
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <IconCard key={item.href} {...item} />
      ))}
    </div>
  );
}

const languages = [
  {
    href: "/docs/durable-execution/quick-start/typescript-quick-start?ref=docs-home",
    title: "TypeScript",
    description: "Works with Node.js, Bun, Deno, and edge runtimes.",
    icon: <IconTypeScript size={28} className="text-[#3178C6]" />,
  },
  {
    href: "/docs/durable-execution/quick-start/python-quick-start?ref=docs-home",
    title: "Python",
    description: "Sync and async functions with FastAPI, Flask, or Django.",
    icon: (
      <IconPython size={28} className="text-[#3776AB] dark:text-[#FFD43B]" />
    ),
  },
  {
    href: "/docs/durable-execution/quick-start/go-quick-start?ref=docs-home",
    title: "Go",
    description: "Typed events and durable steps with the standard library.",
    icon: <IconGo size={44} className="text-[#00ADD8]" />,
  },
];

const frameworks = [
  { href: "/docs/getting-started/nextjs-quick-start", title: "Next.js" },
  { href: "/docs/getting-started/nodejs-quick-start", title: "Node.js" },
  { href: "/docs/getting-started/express-quick-start", title: "Express" },
  {
    href: "/docs/getting-started/tanstack-start-quick-start",
    title: "TanStack Start",
  },
  { href: "/docs/getting-started/nestjs-quick-start", title: "NestJS" },
  { href: "/docs/getting-started/astro-quick-start", title: "Astro" },
  { href: "/docs/getting-started/h3-quick-start", title: "H3" },
  {
    href: "/docs/getting-started/python-quick-start",
    title: "FastAPI & Flask",
  },
];

export function StartBuilding() {
  return (
    <>
      <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {languages.map((l) => (
          <Link key={l.href} href={l.href} className={clsx(cardBase, "p-5")}>
            <div className="mb-3 flex h-9 items-center">{l.icon}</div>
            <h3 className={titleClass}>{l.title}</h3>
            <p className={descClass}>{l.description}</p>
          </Link>
        ))}
      </div>
      <p>Or start from your framework:</p>
      <div className="not-prose my-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {frameworks.map((f) => (
          <Link
            key={f.href}
            href={`${f.href}?ref=docs-home`}
            className={clsx(
              cardSurface,
              "flex items-center justify-between px-4 py-3 text-sm font-medium text-basis"
            )}
          >
            {f.title}
            <RiArrowRightLine className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </>
  );
}
