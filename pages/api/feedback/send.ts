import { Inngest } from "inngest";

const inngest = new Inngest({
  id: "website",
  eventKey: process.env.NEXT_PUBLIC_INNGEST_KEY,
});

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    page,
    rating,
  }: {
    page: string | null;
    rating: string | null;
  } = req.body;

  if (!page) {
    return res.status(400).json({ error: "Page ID is required" });
  }

  if (!rating) {
    return res.status(400).json({ error: "Rating is required" });
  }

  //  disable in development
  if (process.env.NODE_ENV === "development") {
    console.log("Skipping feedback in development");
    console.log({ page, rating });
    return res.status(201).json({ error: "" });
  }

  try {
    await inngest.send({
      name: "website/docs.feedback.received",
      data: {
        page,
        rating,
      },
    });

    return res.status(201).json({ error: "" });
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
};
