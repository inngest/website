import { NextResponse } from "next/server";
import { Inngest } from "inngest";

export const runtime = "nodejs";

const inngest = new Inngest({
  id: "website",
  eventKey: process.env.NEXT_PUBLIC_INNGEST_KEY,
});

const SDKS = new Set(["typescript", "python", "go"]);

export async function POST(req: Request) {
  let body: {
    feature?: unknown;
    sdk?: unknown;
    capability?: unknown;
    page?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const feature = typeof body.feature === "string" ? body.feature.slice(0, 64) : "";
  const sdk = typeof body.sdk === "string" ? body.sdk : "";
  const capability =
    typeof body.capability === "string" ? body.capability.slice(0, 64) : undefined;
  const page = typeof body.page === "string" ? body.page.slice(0, 256) : "";

  if (!feature || !SDKS.has(sdk)) {
    return NextResponse.json(
      { error: "feature and a valid sdk are required" },
      { status: 400 }
    );
  }

  const event = {
    name: "website/docs.sdk-interest.requested",
    data: { feature, sdk, capability, page },
  };

  // Disable in development, matching the docs feedback route.
  if (process.env.NODE_ENV === "development") {
    console.log("Skipping SDK interest event in development", event);
    return NextResponse.json({ error: "" }, { status: 201 });
  }

  try {
    await inngest.send(event);
    return NextResponse.json({ error: "" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
