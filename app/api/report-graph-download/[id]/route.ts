import * as path from "node:path";

import { getReportGraph } from "app/content/ai-in-production-report-2026/graphs";
import { getFullURL } from "src/utils/social";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const graph = getReportGraph(id);
  if (!graph) {
    return new Response("Not found", { status: 404 });
  }

  const upstream = await fetch(getFullURL(graph.image));
  if (!upstream.ok) {
    return new Response("Not found", { status: 404 });
  }

  const filename = path.basename(graph.image);
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
