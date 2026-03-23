import { NextResponse } from "next/server";
import { Inngest } from "inngest";

const inngest = new Inngest({
  id: "website",
  eventKey: process.env.NEXT_PUBLIC_INNGEST_KEY,
});

export async function POST(req: Request) {
  const {
    page,
    rating,
  }: {
    page: string | null;
    rating: string | null;
  } = await req.json();

  if (!page) {
    return NextResponse.json({ error: "Page ID is required" }, { status: 400 });
  }

  if (!rating) {
    return NextResponse.json({ error: "Rating is required" }, { status: 400 });
  }

  //  disable in development
  if (process.env.NODE_ENV === "development") {
    console.log("Skipping feedback in development");
    console.log({ page, rating });
    return NextResponse.json({ error: "" }, { status: 201 });
  }

  try {
    await inngest.send({
      name: "website/docs.feedback.received",
      data: {
        page,
        rating,
      },
    });

    return NextResponse.json({ error: "" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
