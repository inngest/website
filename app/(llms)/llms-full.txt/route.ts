import { processDirectory } from "../utils";
import path from "node:path";

export const dynamic = "force-static";

export async function GET() {
  const content = processDirectory(
    path.join(process.cwd(), "pages", "docs")
  ).join("\n");
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain;charset=UTF-8",
      "Cache-Control": "s-maxage=360, stale-while-revalidate",
    },
  });
}
