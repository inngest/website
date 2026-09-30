// Hand-drawn diagram for the Cloud architecture page. Mermaid can't place a
// side node on the same rank as a spine node, so this is plain SVG using the
// same palette as the Mermaid component.

type Kind = "accent" | "muted" | "info";

const box: Record<Kind, string> = {
  accent:
    "fill-[#f0faf4] stroke-[#2f9e62] dark:fill-[#0b2a1b] dark:stroke-[#3fa46d]",
  muted:
    "fill-white stroke-[#d4d4d4] dark:fill-[#151515] dark:stroke-[#3a3a3a]",
  info: "fill-[#f0f6ff] stroke-[#4a8be8] dark:fill-[#0d2140] dark:stroke-[#5a9cf0]",
};

const text: Record<Kind, string> = {
  accent: "fill-[#0c4a2a] dark:fill-[#b9ebcb]",
  muted: "fill-[#6b6b6b] dark:fill-[#a3a3a3]",
  info: "fill-[#143d80] dark:fill-[#c4ddff]",
};

const line = "stroke-[#a3a3a3] dark:stroke-[#6b6b6b]";
const labelText = "fill-[#6b6b6b] dark:fill-[#a3a3a3]";

function Node({
  x,
  y,
  w,
  h = 40,
  kind,
  lines,
  pill = false,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  kind: Kind;
  lines: string[];
  pill?: boolean;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const lh = 17;
  const start = cy - ((lines.length - 1) * lh) / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={pill ? h / 2 : 6}
        className={box[kind]}
        strokeWidth={kind === "muted" ? 1 : 1.25}
        strokeDasharray={kind === "muted" ? "4 3" : undefined}
      />
      {lines.map((l, i) => (
        <text
          key={l}
          x={cx}
          y={start + i * lh}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={i === 0 ? 13 : 12}
          fontWeight={i === 0 ? 500 : 400}
          className={text[kind]}
        >
          {l}
        </text>
      ))}
    </g>
  );
}

function Down({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <line
      x1={x}
      y1={y1}
      x2={x}
      y2={y2 - 2}
      className={line}
      strokeWidth={1.25}
      markerEnd="url(#arch-arrow)"
    />
  );
}

export function ArchitectureFlow() {
  const cx = 190; // spine center
  const w = 200;
  const x = cx - w / 2;
  return (
    <figure
      role="img"
      aria-label="The Event API publishes an event to Pub/Sub. New Runs matches it to function triggers, applies flow control, and adds the run to a queue. Executors take work from the queue and call your app over HTTP or Connect. The Invoke Function API skips Pub/Sub, matching, and the queue, and calls the executors directly."
      className="not-prose mx-auto my-8 w-full max-w-[600px] overflow-x-auto rounded-xl border border-carbon-200 bg-white p-6 dark:border-carbon-800 dark:bg-[#0a0a0a] sm:p-8"
    >
      <svg
        viewBox="0 0 520 460"
        className="mx-auto h-auto w-full max-w-[520px]"
        style={{ fontFamily: "inherit" }}
      >
        <defs>
          <marker
            id="arch-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M0,0 L10,5 L0,10 z"
              className="fill-[#a3a3a3] dark:fill-[#6b6b6b]"
            />
          </marker>
        </defs>

        <Node x={x} y={10} w={w} kind="accent" lines={["Event API"]} />
        <Down x={cx} y1={50} y2={80} />
        <Node x={x} y={80} w={w} kind="muted" lines={["Pub/Sub"]} />
        <Down x={cx} y1={120} y2={150} />
        <Node
          x={x}
          y={150}
          w={w}
          h={56}
          kind="accent"
          lines={["New Runs", "match triggers · flow control"]}
        />
        <Down x={cx} y1={206} y2={236} />
        <Node x={x} y={236} w={w} kind="muted" lines={["Queue"]} />
        <Down x={cx} y1={276} y2={306} />
        <Node x={x} y={306} w={w} kind="accent" lines={["Executors"]} />

        {/* Fast invoke: in line with Executors, pointing left */}
        <Node
          x={360}
          y={306}
          w={150}
          kind="info"
          lines={["Invoke Function API"]}
        />
        <line
          x1={360}
          y1={326}
          x2={x + w + 2}
          y2={326}
          className={line}
          strokeWidth={1.25}
          strokeDasharray="4 3"
          markerEnd="url(#arch-arrow)"
        />
        <text
          x={(360 + x + w) / 2}
          y={316}
          textAnchor="middle"
          fontSize={11}
          className={labelText}
        >
          fast invoke
        </text>

        <Down x={cx} y1={346} y2={400} />
        <text x={cx + 10} y={377} fontSize={11} className={labelText}>
          HTTP or Connect
        </text>
        <Node
          x={cx - 70}
          y={400}
          w={140}
          kind="info"
          lines={["Your app"]}
          pill
        />
      </svg>
    </figure>
  );
}
