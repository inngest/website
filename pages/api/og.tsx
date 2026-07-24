import type { NextApiRequest } from "next";
import { ImageResponse } from "@vercel/og";
import Logo from "src/shared/Icons/Logo";

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
    // 2026 salmon background — the logo is baked into the artwork
    // (top-left); the title overlays bottom-left in white to match the
    // static homepage card.
    const backgroundImageURL = `${process.env.NEXT_PUBLIC_HOST}/assets/og-image-2026.png`;

    const fontData = await loadInngestCDNFont("Whyte/ABCWhyte-Light.otf");

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "rgb(255,87,51)", // salmon fallback
            backgroundImage: `url("${backgroundImageURL}")`,
            backgroundSize: "cover",
            height: "100%",
            width: "100%",
            padding: "64px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            flexDirection: "column",
            flexWrap: "nowrap",
            fontFamily: "Whyte, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: isVeryLongTitle ? 56 : isLongTitle ? 72 : 92,
              fontStyle: "normal",
              fontWeight: 300,
              letterSpacing: "-2.4px",
              color: "white",
              lineHeight: isVeryLongTitle ? 1.15 : isLongTitle ? 1.12 : 1.05,
              whiteSpace: "normal",
              maxHeight: 420,
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
