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
      ? searchParams.get("title")?.slice(0, 100)
      : "Inngest";
    const isLongTitle = (title || "").length > 40;
    const backgroundImageURL = `${process.env.NEXT_PUBLIC_HOST}/assets/open-graph/og-background-2025.png`;

    const fontData = await loadInngestCDNFont("Whyte/ABCWhyte-Light.otf");

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "rgb(2,2,2)", // carbon-1000
            backgroundImage: `url("${backgroundImageURL}")`,
            height: "100%",
            width: "100%",
            padding: "10% 6%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "column",
            flexWrap: "nowrap",
            fontFamily: "Metropolis, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: isLongTitle ? 72 : 96,
              fontStyle: "normal",
              fontWeight: 500,
              letterSpacing: "-2.4px",
              color: "white",
              marginTop: isLongTitle ? 116 : 94,
              padding: "0 0 0 154px",
              lineHeight: isLongTitle ? 1.22 : 1.2,
              whiteSpace: "normal",
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
            name: "Metropolis",
            data: fontData,
            style: "normal",
            weight: 500,
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
