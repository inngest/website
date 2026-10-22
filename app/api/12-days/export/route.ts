import { NextResponse } from "next/server";
import { checkInDates, checkInsOn } from "@/utils/twelveDays/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/12-days/export[?date=YYYY-MM-DD] — check-ins as CSV, for one
 * Eastern date or every date so far. Requires
 * `Authorization: Bearer $TWELVE_DAYS_EXPORT_TOKEN`.
 */
export async function GET(req: Request) {
  const token = process.env.TWELVE_DAYS_EXPORT_TOKEN;
  if (!token || req.headers.get("authorization") !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const date = new URL(req.url).searchParams.get("date");
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "date must be YYYY-MM-DD" },
      { status: 400 }
    );
  }

  const dates = date ? [date] : await checkInDates();
  const rows = (await Promise.all(dates.map(checkInsOn))).flat();

  const cell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [
    ["date", "email", "user_id", "lesson", "lessons_completed"].join(","),
    ...rows.map((r) =>
      [r.date, r.email, r.userId, r.day, r.total].map(cell).join(",")
    ),
  ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="12-days-check-ins${
        date ? `-${date}` : ""
      }.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
