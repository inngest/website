import { ImageResponse } from "next/og";
import { SCENE } from "@/components/v1/pages/WorkflowCards/art.generated";
import { CHARACTERS } from "@/components/v1/pages/WorkflowCards/characters";
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

/** The 12 Days poster colours. */
const SALMON = "#F55C50";
const INK = "#010101";

/** The mouth and tongue run along the bottom, as on the long-run cards. */
const SCENE_W = 1240;
const SCENE_H = Math.round((SCENE_W * SCENE.height) / SCENE.width);
const SCENE_X = -40;
// Low enough that the lips clear the text block above them.
const SCENE_Y = 386;

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
  cache,
  download,
}: {
  spec: CardSpec;
  face: string | null;
  cache: string;
  download: boolean;
}) {
  try {
    const [poster, mono] = await Promise.all([
      // The 12 Days poster face: Circular, heaviest weight.
      loadFont("Circular/CircularXXWeb-ExtraBlack.woff"),
      loadFont("WhyteMono/ABCWhyteMono-Regular.otf"),
    ]);

    const image = new ImageResponse(<Card spec={spec} face={face} />, {
      width: W,
      height: H,
      fonts: [
        { name: "Circular", data: poster, style: "normal", weight: 900 },
        { name: "WhyteMono", data: mono, style: "normal", weight: 400 },
      ],
      headers: { "Cache-Control": cache },
    });

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
    cache: "private, no-store",
    download: false,
  });
}

function Card({ spec, face }: { spec: CardSpec; face: string | null }) {
  const c = CHARACTERS[spec.input.character];
  const height = Math.round((c.width * c.art.height) / c.art.width);

  const runner = (
    <img
      src={c.art.src}
      width={c.width}
      height={height}
      style={{ position: "absolute", left: c.left, top: c.top }}
    />
  );
  const tongue = (
    <img
      src={SCENE.src}
      width={SCENE_W}
      height={SCENE_H}
      style={{ position: "absolute", left: SCENE_X, top: SCENE_Y }}
    />
  );
  // Faces get the art's heavy black outline so they read as part of it.
  const faces = c.faces.map((f, i) => {
    const r = Math.round(f.r * c.width);
    const style = {
      position: "absolute" as const,
      left: c.left + f.x * c.width - r,
      top: c.top + f.y * height - r,
      width: r * 2,
      height: r * 2,
      borderRadius: 999,
      border: `${Math.max(4, Math.round(r / 12))}px solid ${INK}`,
    };
    return face ? (
      <img
        key={i}
        src={face}
        width={r * 2}
        height={r * 2}
        style={{ ...style, objectFit: "cover" }}
      />
    ) : (
      <div
        key={i}
        style={{
          ...style,
          backgroundColor: "#ECFE08",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "WhyteMono",
          fontSize: Math.max(11, Math.round(r / 3.2)),
          lineHeight: 1.1,
          color: INK,
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex" }}>Your</div>
        <div style={{ display: "flex" }}>face</div>
        <div style={{ display: "flex" }}>here</div>
      </div>
    );
  });

  return (
    <div
      style={{
        width: W,
        height: H,
        display: "flex",
        position: "relative",
        backgroundColor: SALMON,
        color: INK,
        fontFamily: "Circular",
        overflow: "hidden",
      }}
    >
      {c.behindTongue ? (
        <>
          {runner}
          {faces}
          {tongue}
        </>
      ) : (
        <>
          {tongue}
          {runner}
          {faces}
        </>
      )}

      {/* Poster type: chip, huge white line, mono line, name. */}
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "WhyteMono",
            fontSize: 17,
            textTransform: "uppercase",
            padding: "6px 14px",
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.35)",
          }}
        >
          Inngest · 12 Days of Workflows
        </div>
        <div
          style={{
            fontSize: 184,
            lineHeight: 0.86,
            letterSpacing: -6,
            color: "#FFFFFF",
            marginTop: 26,
            marginLeft: -8,
            textTransform: "uppercase",
          }}
        >
          {spec.big}
        </div>
        <div
          style={{
            fontFamily: "WhyteMono",
            fontSize: 28,
            lineHeight: 1.1,
            textTransform: "uppercase",
            marginTop: 18,
            maxWidth: 620,
          }}
        >
          {spec.small}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 22,
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1,
              textTransform: "uppercase",
              color: "#FFFFFF",
              backgroundColor: INK,
              padding: "10px 16px 8px",
              borderRadius: 8,
            }}
          >
            {spec.input.name}
          </div>
          {spec.input.github && face && (
            <div
              style={{ display: "flex", fontFamily: "WhyteMono", fontSize: 18 }}
            >
              {`@${spec.input.github}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
