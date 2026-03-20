import { llmContextContent, llmContextHeaders } from "../llm-context-content";

export const dynamic = "force-static";

export async function GET() {
  return new Response(llmContextContent, {
    headers: llmContextHeaders,
  });
}
