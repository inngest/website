import { ImageResponse } from "next/og";
import {
  parseCardInput,
  runWeirdWorkflow,
  type CardSpec,
} from "@/components/v1/pages/WorkflowCards/workflow";

/**
 * GET /api/workflow-card?name=&kind=&day=&n=
 *
 * Renders an Inngest Card Shop card as a 1200×630 PNG. It's the social
 * image for /12-days/card (so a shared link unfurls as the card) and the
 * file behind the page's Download button (?download=1).
 */

const W = 1200;
const H = 630;

const fontCache = new Map<string, Promise<ArrayBuffer>>();
const loadFont = (path: string) => {
  if (!fontCache.has(path)) {
    fontCache.set(
      path,
      fetch(`https://fonts-cdn.inngest.com/${path}`).then((res) => {
        if (!res.ok) throw new Error(`font ${path}: ${res.status}`);
        return res.arrayBuffer();
      })
    );
  }
  return fontCache.get(path)!;
};

/**
 * The sender's GitHub avatar as a data URI, or null. Fetched here rather
 * than by the renderer so a slow or missing avatar can't fail the card.
 */
async function loadAvatar(github: string): Promise<string | null> {
  if (!github) return null;
  try {
    const res = await fetch(`https://github.com/${github}.png?size=160`, {
      signal: AbortSignal.timeout(3000),
    });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.startsWith("image/")) return null;
    const bytes = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const spec = runWeirdWorkflow(parseCardInput((k) => searchParams.get(k)));

  try {
    const [whyte, mono, avatar] = await Promise.all([
      loadFont("Whyte/ABCWhyte-Light.otf"),
      loadFont("WhyteMono/ABCWhyteMono-Regular.otf"),
      loadAvatar(spec.input.github),
    ]);

    const image = new ImageResponse(<Card spec={spec} avatar={avatar} />, {
      width: W,
      height: H,
      fonts: [
        { name: "Whyte", data: whyte, style: "normal", weight: 300 },
        { name: "WhyteMono", data: mono, style: "normal", weight: 400 },
      ],
      headers: {
        // Deterministic per URL, so it can cache hard.
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, immutable",
      },
    });

    if (searchParams.get("download")) {
      const slug =
        spec.input.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "card";
      image.headers.set(
        "Content-Disposition",
        `attachment; filename="inngest-card-${slug}.png"`
      );
    }
    return image;
  } catch (e) {
    console.error("Error generating workflow card:", e);
    // Fonts are fetched once per instance; let the next request retry.
    fontCache.clear();
    return new Response("Failed to generate the card", { status: 500 });
  }
}

function Card({ spec, avatar }: { spec: CardSpec; avatar: string | null }) {
  const p = spec.palette;
  const headlineSize = spec.headline.length > 80 ? 46 : 54;

  return (
    <div
      style={{
        width: W,
        height: H,
        display: "flex",
        position: "relative",
        backgroundColor: p.bg,
        color: p.fg,
        fontFamily: "Whyte",
        overflow: "hidden",
      }}
    >
      {/* step.fetch: snow */}
      {spec.snow.map((s, i) => (
        <div
          key={`s${i}`}
          style={{
            position: "absolute",
            left: s.x * W,
            top: s.y * H,
            width: s.size,
            height: s.size,
            borderRadius: 999,
            backgroundColor: p.fg,
            opacity: s.opacity * 0.35,
          }}
        />
      ))}
      {/* step.sleep: glitter */}
      {spec.glitter.map((s, i) => (
        <div
          key={`g${i}`}
          style={{
            position: "absolute",
            left: s.x * W,
            top: s.y * H,
            width: s.size,
            height: s.size,
            transform: "rotate(45deg)",
            backgroundColor: i % 2 ? p.accent : p.bar,
            opacity: s.opacity,
          }}
        />
      ))}

      <Garland spec={spec} />

      {/* Left: the card copy */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 650,
          padding: "120px 0 48px 56px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "WhyteMono",
              fontSize: 18,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: p.accent,
              marginBottom: 20,
            }}
          >
            {spec.eyebrow}
          </div>
          <div
            style={{
              fontSize: headlineSize,
              lineHeight: 1.06,
              letterSpacing: -1.6,
            }}
          >
            {spec.headline}
          </div>
          <div
            style={{
              fontSize: 24,
              lineHeight: 1.3,
              marginTop: 22,
              color: p.muted,
            }}
          >
            {`“${spec.greeting}”`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 18,
            }}
          >
            {avatar && (
              // The sender, hung like an ornament.
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 9,
                    backgroundColor: p.muted,
                    borderRadius: "3px 3px 0 0",
                  }}
                />
                <img
                  src={avatar}
                  width={68}
                  height={68}
                  style={{
                    borderRadius: 999,
                    border: `4px solid ${p.accent}`,
                  }}
                />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 30 }}>{`— ${spec.input.name}`}</div>
              {avatar && spec.input.github && (
                <div
                  style={{
                    fontFamily: "WhyteMono",
                    fontSize: 16,
                    color: p.muted,
                    marginTop: 4,
                  }}
                >
                  {`@${spec.input.github}`}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {spec.stamps.map((stamp, i) => (
              <div
                key={stamp}
                style={{
                  display: "flex",
                  fontFamily: "WhyteMono",
                  fontSize: 14,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  padding: "6px 10px",
                  border: `2px solid ${i === 0 ? p.accent : p.fg}`,
                  color: i === 0 ? p.accent : p.fg,
                  borderRadius: 4,
                  transform: `rotate(${i === 0 ? -3 : i === 1 ? 2 : -1}deg)`,
                }}
              >
                {stamp}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: the run trace */}
      <Trace spec={spec} />
    </div>
  );
}

/** step.invoke: twelve ornaments on a sagging string, one per primitive. */
function Garland({ spec }: { spec: CardSpec }) {
  const p = spec.palette;
  const left = 40;
  const right = W - 40;
  const top = 18;
  const drop = 56;
  const pts = spec.garland.map((y, i) => ({
    x: left + ((right - left) * i) / 11,
    y: top + y * drop,
  }));
  const path = pts
    .map((pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = pts[i - 1];
      const mx = (prev.x + pt.x) / 2;
      const my = Math.max(prev.y, pt.y) + 14;
      return `Q ${mx} ${my} ${pt.x} ${pt.y}`;
    })
    .join(" ");

  // Ornaments that carry a letter of the name are bigger.
  const radius = (i: number) => (spec.garlandLetters[i] ? 17 : 11);

  return (
    <div style={{ position: "absolute", left: 0, top: 0, display: "flex" }}>
      <svg width={W} height={120} viewBox={`0 0 ${W} 120`}>
        <path d={path} fill="none" stroke={p.muted} strokeWidth={2} />
        {pts.map((pt, i) => {
          const row = spec.trace[i];
          const fill = row.waiting ? p.barAlt : p.bar;
          return (
            <g key={i}>
              <rect
                x={pt.x - 4}
                y={pt.y + 2}
                width={8}
                height={6}
                fill={p.muted}
              />
              <circle
                cx={pt.x}
                cy={pt.y + 7 + radius(i)}
                r={radius(i)}
                fill={fill}
              />
              <circle
                cx={pt.x - radius(i) * 0.4}
                cy={pt.y + 7 + radius(i) * 0.6}
                r={3}
                fill="#FFFFFF"
                opacity={0.6}
              />
            </g>
          );
        })}
      </svg>
      {pts.map((pt, i) =>
        spec.garlandLetters[i] ? (
          <div
            key={`l${i}`}
            style={{
              position: "absolute",
              left: pt.x - 17,
              top: pt.y + 7,
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: p.panel,
            }}
          >
            {spec.garlandLetters[i]}
          </div>
        ) : null
      )}
    </div>
  );
}

function Trace({ spec }: { spec: CardSpec }) {
  const p = spec.palette;
  const trackW = 112;
  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        top: 112,
        width: 434,
        display: "flex",
        flexDirection: "column",
        backgroundColor: p.panel,
        color: p.panelFg,
        borderRadius: 10,
        padding: "16px 18px 14px",
        fontFamily: "WhyteMono",
        transform: "rotate(1.5deg)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          marginBottom: 10,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex" }}>{spec.functionId}</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: p.bar,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: p.bar,
            }}
          />
          {
            {
              participating: "Running",
              completed: "Completed",
              stuck: "Waiting",
            }[spec.input.kind]
          }
        </div>
      </div>
      {spec.trace.map((row) => {
        const current = row.status === "current";
        const pending = row.status === "pending";
        return (
          <div
            key={row.primitive}
            style={{
              display: "flex",
              alignItems: "center",
              height: 26,
              fontSize: 13,
              opacity: pending ? 0.35 : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 26,
                opacity: 0.5,
              }}
            >
              {String(row.day).padStart(2, "0")}
            </div>
            <div
              style={{
                display: "flex",
                width: 162,
                color: current ? p.bar : p.panelFg,
              }}
            >
              {row.primitive}
            </div>
            <div
              style={{
                display: "flex",
                position: "relative",
                width: trackW,
                height: 12,
              }}
            >
              {!pending && (
                <div
                  style={{
                    position: "absolute",
                    left: row.offset * trackW,
                    // The current step is still going: its bar runs off
                    // the end of the track.
                    width: current
                      ? trackW * (1 - row.offset)
                      : Math.max(5, row.width * trackW),
                    height: 12,
                    borderRadius: 3,
                    backgroundColor:
                      row.waiting || current ? "transparent" : p.bar,
                    border:
                      row.waiting || current
                        ? `2px dashed ${current ? p.bar : p.barAlt}`
                        : "none",
                  }}
                />
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                flexGrow: 1,
                opacity: current ? 1 : 0.7,
                color: current ? p.bar : p.panelFg,
              }}
            >
              {row.duration}
            </div>
          </div>
        );
      })}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          marginTop: 10,
          opacity: 0.6,
        }}
      >
        <div style={{ display: "flex" }}>{`run ${spec.runId}`}</div>
        <div style={{ display: "flex" }}>{`No. ${spec.serial}`}</div>
      </div>
    </div>
  );
}
