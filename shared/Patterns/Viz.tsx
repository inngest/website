// Section visualizations. Each takes an `accent` (hex) and renders a small
// schematic diagram that conveys what the primitive does.

import type { ReactNode } from "react";

const VIZ_W = 480;
const VIZ_H = 280;

type VizProps = { accent: string };

function VizFrame({
  accent,
  label,
  sublabel,
  children,
}: {
  accent: string;
  label: string;
  sublabel?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="viz-frame"
      style={{ ["--accent" as any]: accent }}
    >
      <svg
        viewBox={`0 0 ${VIZ_W} ${VIZ_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="viz-svg"
      >
        {children}
      </svg>
      <div className="viz-caption">
        <span className="viz-caption-label">{label}</span>
        {sublabel ? <span className="viz-caption-sub">{sublabel}</span> : null}
      </div>
    </div>
  );
}

function VizDurable({ accent }: VizProps) {
  const steps = [
    { name: "validate.input", ms: 12, state: "ok" },
    { name: "fetch.profile", ms: 86, state: "ok" },
    { name: "score.transaction", ms: 1240, state: "retry" },
    { name: "notify.user", ms: 320, state: "ok" },
    { name: "write.audit", ms: 18, state: "ok" },
  ];
  const startX = 40;
  const stepH = 28;
  const top = 36;
  const maxW = 280;
  const max = Math.max(...steps.map((s) => s.ms));

  return (
    <VizFrame accent={accent} label="trace" sublabel="durable execution · 1.7s">
      <line
        x1={startX - 14}
        y1={top - 8}
        x2={startX - 14}
        y2={top + steps.length * stepH + 6}
        stroke="#2a2620"
        strokeWidth="1"
      />
      {steps.map((s, i) => {
        const w = Math.max(28, (s.ms / max) * maxW);
        const y = top + i * stepH;
        const color = s.state === "retry" ? "#FCC43F" : accent;
        return (
          <g key={i}>
            <circle cx={startX - 14} cy={y + 9} r="2" fill={color} />
            <rect
              x={startX}
              y={y}
              width={w}
              height="18"
              rx="2"
              fill={color}
              fillOpacity="0.14"
              stroke={color}
              strokeOpacity="0.6"
              strokeWidth="1"
            />
            {s.state === "retry" ? (
              <>
                <rect
                  x={startX}
                  y={y + 22}
                  width={w * 0.35}
                  height="6"
                  rx="2"
                  fill="#FCC43F"
                  fillOpacity="0.2"
                  stroke="#FCC43F"
                  strokeOpacity="0.5"
                  strokeWidth="0.75"
                />
                <text
                  x={startX + w + 8}
                  y={y + 13}
                  fontFamily="Geist Mono, monospace"
                  fontSize="9"
                  fill="#FCC43F"
                  letterSpacing="0.5"
                >
                  retry · 2/3
                </text>
              </>
            ) : (
              <text
                x={startX + w + 8}
                y={y + 13}
                fontFamily="Geist Mono, monospace"
                fontSize="9"
                fill="#6f665d"
                letterSpacing="0.5"
              >
                {s.ms}ms
              </text>
            )}
            <text
              x={startX + 8}
              y={y + 13}
              fontFamily="Geist Mono, monospace"
              fontSize="10"
              fill="#d6d0c4"
              letterSpacing="0.5"
            >
              {s.name}
            </text>
          </g>
        );
      })}
    </VizFrame>
  );
}

function VizFlow({ accent }: VizProps) {
  const lanes: (number | null)[][] = [
    [0, 30, 75, 130, 175, 230, 290, 340, 380, 430],
    [10, 60, 110, 170, 220, 270, 320, 360, 405, 445],
    [25, 80, 145, 200, 260, 310, 365, 415, null, null],
  ];
  const top = 50;
  const laneH = 56;
  const blockW = 38;
  const blockH = 22;

  return (
    <VizFrame
      accent={accent}
      label="concurrency"
      sublabel="3 lanes · 12 rps throttle"
    >
      <line
        x1={250}
        y1={20}
        x2={250}
        y2={260}
        stroke={accent}
        strokeOpacity="0.7"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <text
        x={254}
        y={32}
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill={accent}
        letterSpacing="1"
      >
        ↘ THROTTLE
      </text>

      {lanes.map((lane, li) => (
        <g key={li}>
          <line
            x1="20"
            y1={top + li * laneH + 11}
            x2="460"
            y2={top + li * laneH + 11}
            stroke="#1f1c1a"
            strokeWidth="1"
          />
          <text
            x="2"
            y={top + li * laneH + 14}
            fontFamily="Geist Mono, monospace"
            fontSize="9"
            fill="#6f665d"
          >
            {String(li + 1).padStart(2, "0")}
          </text>
          {lane.map((x, ci) =>
            x === null ? null : (
              <rect
                key={ci}
                x={20 + x * 0.9}
                y={top + li * laneH}
                width={blockW}
                height={blockH}
                rx="2"
                fill={x > 250 ? "#0d0c0b" : accent}
                fillOpacity={x > 250 ? 1 : 0.18}
                stroke={accent}
                strokeOpacity={x > 250 ? 0.35 : 0.6}
                strokeWidth="1"
              />
            )
          )}
        </g>
      ))}
    </VizFrame>
  );
}

function VizEvents({ accent }: VizProps) {
  const src = { x: 70, y: 140 };
  const fns = [
    { x: 360, y: 50, label: "send.email", state: "ok" },
    { x: 360, y: 110, label: "update.crm", state: "ok" },
    { x: 360, y: 170, label: "score.lead", state: "wait" },
    { x: 360, y: 230, label: "notify.slack", state: "ok" },
  ];

  return (
    <VizFrame
      accent={accent}
      label="event"
      sublabel="user.signed_up · 4 listeners"
    >
      <defs>
        <marker
          id="ev-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={accent} opacity="0.8" />
        </marker>
      </defs>
      {fns.map((f, i) => (
        <path
          key={i}
          d={`M ${src.x + 18} ${src.y} C ${(src.x + f.x) / 2} ${src.y}, ${
            (src.x + f.x) / 2
          } ${f.y}, ${f.x - 50} ${f.y}`}
          fill="none"
          stroke={f.state === "wait" ? "#6f665d" : accent}
          strokeOpacity={f.state === "wait" ? 0.6 : 0.5}
          strokeWidth="1"
          strokeDasharray={f.state === "wait" ? "2 3" : "0"}
          markerEnd="url(#ev-arrow)"
        />
      ))}
      <circle
        cx={src.x}
        cy={src.y}
        r="22"
        fill={accent}
        fillOpacity="0.15"
        stroke={accent}
        strokeWidth="1.25"
      />
      <circle cx={src.x} cy={src.y} r="6" fill={accent} />
      <text
        x={src.x}
        y={src.y + 44}
        textAnchor="middle"
        fontFamily="Geist Mono, monospace"
        fontSize="10"
        fill={accent}
        letterSpacing="1.5"
      >
        EVENT
      </text>
      {fns.map((f, i) => (
        <g key={i}>
          <rect
            x={f.x - 50}
            y={f.y - 13}
            width="100"
            height="26"
            rx="3"
            fill="#0d0c0b"
            stroke={f.state === "wait" ? "#6f665d" : accent}
            strokeOpacity={f.state === "wait" ? 0.6 : 0.5}
            strokeWidth="1"
            strokeDasharray={f.state === "wait" ? "2 2" : "0"}
          />
          <text
            x={f.x}
            y={f.y + 4}
            textAnchor="middle"
            fontFamily="Geist Mono, monospace"
            fontSize="10"
            fill={f.state === "wait" ? "#9b9b9b" : "#d6d0c4"}
            letterSpacing="0.5"
          >
            {f.label}
          </text>
        </g>
      ))}
    </VizFrame>
  );
}

function VizSchedule({ accent }: VizProps) {
  const y = 160;
  const start = 30;
  const end = 450;
  const ticks = [60, 105, 150, 195, 240, 285, 330, 375, 420];
  const sleepFrom = 105;
  const sleepTo = 330;

  return (
    <VizFrame
      accent={accent}
      label="timeline"
      sublabel="cron · 0 9 * * * + sleepUntil"
    >
      <line x1={start} y1={y} x2={end} y2={y} stroke="#2a2620" strokeWidth="1" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const x = start + i * 50;
        return (
          <g key={i}>
            <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="#2a2620" strokeWidth="1" />
            <text
              x={x}
              y={y + 22}
              fontFamily="Geist Mono, monospace"
              fontSize="9"
              fill="#6f665d"
              textAnchor="middle"
            >
              {String(i).padStart(2, "0")}
            </text>
          </g>
        );
      })}
      <path
        d={`M ${sleepFrom} ${y} Q ${(sleepFrom + sleepTo) / 2} ${y - 90} ${sleepTo} ${y}`}
        fill="none"
        stroke={accent}
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <text
        x={(sleepFrom + sleepTo) / 2}
        y={y - 76}
        textAnchor="middle"
        fontFamily="Geist Mono, monospace"
        fontSize="10"
        fill={accent}
        letterSpacing="1.5"
      >
        sleepUntil("09:00")
      </text>
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={t}
            y1={y - 14}
            x2={t}
            y2={y + 14}
            stroke={accent}
            strokeOpacity="0.7"
            strokeWidth="1.25"
          />
          <circle cx={t} cy={y} r="3" fill={accent} />
        </g>
      ))}
      <line
        x1={240}
        y1={y - 30}
        x2={240}
        y2={y + 30}
        stroke="#d6d0c4"
        strokeOpacity="0.5"
        strokeWidth="1"
        strokeDasharray="1 2"
      />
      <text
        x={240}
        y={y - 36}
        textAnchor="middle"
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill="#d6d0c4"
        letterSpacing="1"
      >
        now
      </text>
    </VizFrame>
  );
}

function VizJobs({ accent }: VizProps) {
  const depths = [4, 7, 12, 18, 22, 16, 11, 8, 6, 4, 5, 7, 9, 6, 4];
  const barW = 22;
  const barGap = 6;
  const startX = 30;
  const baseY = 220;
  const scale = 5.5;

  return (
    <VizFrame
      accent={accent}
      label="queue"
      sublabel="background workers · 24 active"
    >
      <line
        x1={startX - 4}
        y1={baseY}
        x2={startX + depths.length * (barW + barGap)}
        y2={baseY}
        stroke="#2a2620"
        strokeWidth="1"
      />
      <text
        x={startX}
        y={40}
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill="#6f665d"
        letterSpacing="1"
      >
        REQUEST  ───────────►
      </text>
      <text
        x={startX}
        y={64}
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill={accent}
        letterSpacing="1"
      >
        BACKGROUND ────►
      </text>
      {depths.map((d, i) => {
        const h = d * scale;
        const x = startX + i * (barW + barGap);
        return (
          <g key={i}>
            <rect
              x={x}
              y={baseY - h}
              width={barW}
              height={h}
              rx="1"
              fill={accent}
              fillOpacity="0.16"
              stroke={accent}
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            {d > 18 ? (
              <rect
                x={x}
                y={baseY - h - 6}
                width={barW}
                height={4}
                rx="1"
                fill={accent}
                fillOpacity="0.5"
              />
            ) : null}
          </g>
        );
      })}
      <text
        x={startX}
        y={baseY + 18}
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill="#6f665d"
        letterSpacing="0.5"
      >
        t-3m
      </text>
      <text
        x={startX + depths.length * (barW + barGap) - 18}
        y={baseY + 18}
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill="#6f665d"
        letterSpacing="0.5"
      >
        now
      </text>
      <text
        x={startX + (depths.length * (barW + barGap)) / 2}
        y={baseY - 122}
        textAnchor="middle"
        fontFamily="Geist Mono, monospace"
        fontSize="9"
        fill={accent}
        letterSpacing="1"
      >
        QUEUE DEPTH
      </text>
    </VizFrame>
  );
}

const VIZ_BY_ID = {
  durable: VizDurable,
  flow: VizFlow,
  events: VizEvents,
  schedule: VizSchedule,
  jobs: VizJobs,
} as const;

export type VizId = keyof typeof VIZ_BY_ID;

export default function Viz({ id, accent }: { id: VizId; accent: string }) {
  const Comp = VIZ_BY_ID[id];
  if (!Comp) return null;
  return <Comp accent={accent} />;
}
