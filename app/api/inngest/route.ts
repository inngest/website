import { serve } from "inngest/next";
import { inngest, twelveDaysFunctions } from "@/utils/twelveDays/functions";

export const runtime = "nodejs";

/**
 * Inngest serve endpoint for the website's own functions. Needs
 * `INNGEST_SIGNING_KEY` from the same Inngest environment as
 * `NEXT_PUBLIC_INNGEST_KEY`, and the app synced at
 * https://www.inngest.com/api/inngest.
 */
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [...twelveDaysFunctions],
});
