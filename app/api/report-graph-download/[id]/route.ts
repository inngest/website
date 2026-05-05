import * as fs from "node:fs";
import * as path from "node:path";

import {
  getReportGraph,
  REPORT_GRAPHS,
} from "app/content/ai-in-production-report-2026/graphs";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return Object.keys(REPORT_GRAPHS).map((id) => ({ id }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const graph = getReportGraph(id);
  if (!graph) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", graph.image);
  let file: Buffer;
  try {
    file = fs.readFileSync(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const filename = path.basename(graph.image);
  return new Response(file, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
