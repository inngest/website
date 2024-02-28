import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

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
    await addRating(page, rating);

    return res.status(201).json({ error: "" });
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
};

async function addRating(page: string, rating: string) {
  const sheet = await loadSheet("ratings");
  await sheet.addRow({ page, rating, time: new Date().toISOString() });
}

async function loadSheet(sheet: string) {
  const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_FEEDBACK_SHEET_ID;
  const GOOGLE_SERVICE_ACCOUNT = new JWT({
    email: process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT);
  await doc.loadInfo();

  return doc.sheetsByTitle[sheet];
}
