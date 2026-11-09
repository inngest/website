import type { ReactElement } from "react";
import { ImageResponse } from "next/og";
import {
  ART_H,
  ART_W,
  CHARACTERS,
} from "@/components/v1/pages/WorkflowCards/characters";
import {
  parseCardInput,
  runWeirdWorkflow,
  type CardSpec,
} from "@/components/v1/pages/WorkflowCards/workflow";

/**
 * GET /api/workflow-card?name=&kind=&day=&n=&gh=&c=
 *
 * Renders an Inngest Card Shop card as a 1200×630 PNG. It's the social
 * image for /12-days/card (so a shared link unfurls as the card) and the
 * file behind the page's Download button (?download=1). The face is the
 * GitHub avatar, or a "your face here" hole without one.
 *
 * POST /api/workflow-card  { query, face }
 *
 * Same card, with an uploaded photo (a small JPEG data URL, resized in
 * the browser) as the face. The photo is drawn and thrown away: nothing
 * is stored, so these cards can be downloaded but not shared by link.
 */

const W = 1200;
const H = 630;

/** Where the 600×560 character art sits on the card. */
const ART_X = 592;
const ART_Y = H - ART_H;

const MAX_FACE_CHARS = 700_000; // ~500KB of JPEG, far more than a 320px one needs
const FACE_DATA_URL = /^data:image\/(jpeg|png);base64,[a-z0-9+/=]+$/i;

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
    const res = await fetch(`https://github.com/${github}.png?size=240`, {
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

async function render({
  spec,
  face,
  origin,
  cache,
  download,
}: {
  spec: CardSpec;
  face: string | null;
  origin: string;
  cache: string;
  download: boolean;
}) {
  try {
    const [whyte, mono] = await Promise.all([
      loadFont("Whyte/ABCWhyte-Light.otf"),
      loadFont("WhyteMono/ABCWhyteMono-Regular.otf"),
    ]);

    const image = new ImageResponse(
      <Card spec={spec} face={face} origin={origin} />,
      {
        width: W,
        height: H,
        fonts: [
          { name: "Whyte", data: whyte, style: "normal", weight: 300 },
          { name: "WhyteMono", data: mono, style: "normal", weight: 400 },
        ],
        headers: { "Cache-Control": cache },
      }
    );

    if (download) {
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

export async function GET(req: Request) {
  const url = new URL(req.url);
  const spec = runWeirdWorkflow(parseCardInput((k) => url.searchParams.get(k)));
  return render({
    spec,
    face: await loadAvatar(spec.input.github),
    origin: url.origin,
    // Deterministic per URL, so it can cache hard.
    cache: "public, max-age=86400, s-maxage=31536000, immutable",
    download: Boolean(url.searchParams.get("download")),
  });
}

export async function POST(req: Request) {
  let body: { query?: unknown; face?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response("Expected JSON", { status: 400 });
  }
  const { query, face } = body;
  if (
    typeof query !== "string" ||
    typeof face !== "string" ||
    face.length > MAX_FACE_CHARS ||
    !FACE_DATA_URL.test(face)
  ) {
    return new Response("Expected { query, face: JPEG/PNG data URL }", {
      status: 400,
    });
  }
  const params = new URLSearchParams(query);
  const spec = runWeirdWorkflow(parseCardInput((k) => params.get(k)));
  return render({
    spec,
    face,
    origin: new URL(req.url).origin,
    cache: "private, no-store",
    download: false,
  });
}

function Card({
  spec,
  face,
  origin,
}: {
  spec: CardSpec;
  face: string | null;
  origin: string;
}) {
  const p = spec.palette;
  const character = CHARACTERS[spec.input.character];
  const f = character.face;
  const art = character.artwork;
  const layer = (src: string) => (
    <img
      src={new URL(src, origin).toString()}
      width={ART_W}
      height={ART_H}
      style={{ position: "absolute", left: ART_X, top: ART_Y }}
    />
  );
  const svgLayer = (draw?: () => ReactElement) =>
    draw ? (
      <div
        style={{
          position: "absolute",
          left: ART_X,
          top: ART_Y,
          display: "flex",
        }}
      >
        {draw()}
      </div>
    ) : null;

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
            opacity: s.opacity * 0.3,
          }}
        />
      ))}

      <Garland spec={spec} />

      {/* The character, in three layers around the face. */}
      {art?.back ? layer(art.back) : svgLayer(character.back)}
      {face ? (
        <img
          src={face}
          width={f.r * 2}
          height={f.r * 2}
          style={{
            position: "absolute",
            left: ART_X + f.cx - f.r,
            top: ART_Y + f.cy - f.r,
            borderRadius: 999,
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            left: ART_X + f.cx - f.r,
            top: ART_Y + f.cy - f.r,
            width: f.r * 2,
            height: f.r * 2,
            borderRadius: 999,
            backgroundColor: p.panel,
            border: `4px dashed ${p.accent}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "WhyteMono",
            fontSize: 20,
            lineHeight: 1.2,
            color: p.accent,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>Your</div>
          <div style={{ display: "flex" }}>face</div>
          <div style={{ display: "flex" }}>here</div>
        </div>
      )}
      {art?.front ? layer(art.front) : svgLayer(character.front)}

      {/* Left: as little text as possible. */}
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 128,
          bottom: 44,
          width: 520,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
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
            }}
          >
            12 Days of Workflows
          </div>
          <div
            style={{
              fontSize: 168,
              lineHeight: 1,
              letterSpacing: -7,
              marginTop: 10,
              marginLeft: -6,
            }}
          >
            {spec.big}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.2, marginTop: 8 }}>
            {spec.small}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 36 }}>{spec.input.name}</div>
          <div
            style={{
              fontFamily: "WhyteMono",
              fontSize: 15,
              color: p.muted,
              marginTop: 6,
            }}
          >
            {spec.input.github && face
              ? `@${spec.input.github} · ${spec.functionId}()`
              : `${spec.functionId}()`}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Twelve ornaments, one per day: lit for the days that have run, a big
 * one for today, dim for what's still queued.
 */
function Garland({ spec }: { spec: CardSpec }) {
  const p = spec.palette;
  const left = 40;
  const right = W - 40;
  const top = 18;
  const drop = 50;
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

  return (
    <div style={{ position: "absolute", left: 0, top: 0, display: "flex" }}>
      <svg width={W} height={110} viewBox={`0 0 ${W} 110`}>
        <path d={path} fill="none" stroke={p.muted} strokeWidth={2} />
        {pts.map((pt, i) => {
          const status = spec.trace[i].status;
          const r = status === "current" ? 17 : 12;
          const fill =
            status === "pending" ? p.muted : i % 2 ? p.barAlt : p.bar;
          return (
            <g key={i} opacity={status === "pending" ? 0.35 : 1}>
              <rect
                x={pt.x - 4}
                y={pt.y + 2}
                width={8}
                height={6}
                fill={p.muted}
              />
              <circle cx={pt.x} cy={pt.y + 7 + r} r={r} fill={fill} />
              <circle
                cx={pt.x - r * 0.4}
                cy={pt.y + 7 + r * 0.6}
                r={3}
                fill="#FFFFFF"
                opacity={0.6}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
