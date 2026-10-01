import type { NextApiRequest } from "next";
import { ImageResponse } from "@vercel/og";
import Logo from "src/shared/Icons/Logo";
import { getFullURL } from "src/utils/social";

export const config = {
  runtime: "edge",
};

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

async function loadInngestCDNFont(fontPath: string) {
  const url = `https://fonts-cdn.inngest.com/${fontPath}`;
  const response = await fetch(url);
  if (response.status == 200) {
    return await response.arrayBuffer();
  }
  throw new Error("failed to load font data");
}

export default async function handler(req: NextApiRequest) {
  try {
    const { searchParams } = new URL(req.url || "");

    // ?title=<title>
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 120)
      : "Inngest";
    const len = (title || "").length;
    const isLongTitle = len > 40;
    const isVeryLongTitle = len > 70;
    // ?theme=long-run — the "Build for the lonng run" campaign card
    // (black, mouth and tongue along the bottom) instead of the standard
    // salmon one. Anything else falls back to the default.
    const isLongRun = searchParams.get("theme") === "long-run";
    // ?eyebrow=<text> — small accent line above the title. Long-run only;
    // the salmon card has no slot for it.
    const eyebrow = searchParams.get("eyebrow")?.slice(0, 60);

    // The logo is baked into both background artworks (top-left). On the
    // salmon card the title overlays bottom-left in white, matching the
    // static homepage card; on the long-run card it sits top-left, above
    // the illustration.
    const backgroundImageURL = isLongRun
      ? // Preview-aware: the campaign artwork only exists on the deploy
        // that added it, so a preview must not fetch it from production.
        getFullURL("/assets/v1/long-run/og-nyc.png")
      : `${process.env.NEXT_PUBLIC_HOST}/assets/og-image-2026.png`;

    const fontData = await loadInngestCDNFont("Whyte/ABCWhyte-Light.otf");

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: isLongRun ? "rgb(16,16,16)" : "rgb(255,87,51)",
            backgroundImage: `url("${backgroundImageURL}")`,
            backgroundSize: "cover",
            height: "100%",
            width: "100%",
            // The long-run artwork fills the bottom half, so its copy sits
            // under the baked-in logo rather than at the foot of the card.
            padding: isLongRun ? "120px 64px 64px" : "64px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: isLongRun ? "flex-start" : "flex-end",
            flexDirection: "column",
            flexWrap: "nowrap",
            fontFamily: "Whyte, sans-serif",
          }}
        >
          {isLongRun && eyebrow && (
            <div
              style={{
                fontSize: 28,
                fontWeight: 300,
                letterSpacing: "2px",
                // v1 accent-green.
                color: "rgb(11,221,72)",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              {eyebrow}
            </div>
          )}
          <div
            style={{
              fontSize: isLongRun
                ? isVeryLongTitle
                  ? 48
                  : isLongTitle
                  ? 56
                  : 72
                : isVeryLongTitle
                ? 56
                : isLongTitle
                ? 72
                : 92,
              fontStyle: "normal",
              fontWeight: 300,
              letterSpacing: "-2.4px",
              color: "white",
              lineHeight: isVeryLongTitle ? 1.15 : isLongTitle ? 1.12 : 1.05,
              whiteSpace: "normal",
              // Keep the title clear of the illustration on the long-run
              // card; the salmon one can run the full height.
              maxHeight: isLongRun ? 170 : 420,
              overflow: "hidden",
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Whyte",
            data: fontData,
            style: "normal",
            weight: 300,
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`Error generating OG image:`, e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
