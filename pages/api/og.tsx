import type { NextApiRequest } from "next";
import { ImageResponse } from "@vercel/og";
import Logo from "src/shared/Icons/Logo";

export const config = {
  runtime: "edge",
};

const font = fetch(
  new URL(
    "../../public/assets/fonts/Metropolis/Metropolis-SemiBold.otf",
    import.meta.url
  )
).then((res) => res.arrayBuffer());

export default async function handler(req: NextApiRequest) {
  try {
    const fontData = await font;
    const { searchParams } = new URL(req.url || "");

    // ?title=<title>
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "Inngest";
    const isLongTitle = (title || "").length > 40;
    const backgroundImageURL = `${process.env.NEXT_PUBLIC_HOST}/assets/open-graph/background-compressed.png`;

    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: "rgb(2,2,2)", // carbon-1000
            backgroundImage: `url("${backgroundImageURL}")`,
            height: "100%",
            width: "100%",
            padding: "7% 6%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "column",
            flexWrap: "nowrap",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <Logo
            width={180}
            fill={"#fefefe"} // carbon-50
            style={{
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: isLongTitle ? 84 : 110,
              fontStyle: "normal",
              fontWeight: 500,
              letterSpacing: "-2.4px",
              color: "white",
              marginTop: 48,
              padding: "0",
              lineHeight: 1.4,
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
            name: "Inter",
            data: fontData,
            style: "normal",
            weight: 500,
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
