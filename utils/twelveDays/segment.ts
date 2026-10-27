/**
 * Server-side Segment calls for the 12 Days of Workflows. Segment passes
 * them on to Customer.io and Attio, the same as the website's form
 * events, which is how check-ins reach the reminder-email list.
 *
 * Uses Segment's HTTP Tracking API with `SEGMENT_WRITE_KEY`, falling
 * back to the website's own source key (`NEXT_PUBLIC_SEGMENT_WRITE_KEY`)
 * so the events land in the source whose destinations already exist.
 */

const BATCH_URL = "https://api.segment.io/v1/batch";

interface Base {
  userId: string;
  /** Segment drops a repeat of the same id, so resends don't double up. */
  messageId: string;
  timestamp: string;
}

export type SegmentMessage =
  | (Base & { type: "identify"; traits: Record<string, unknown> })
  | (Base & {
      type: "track";
      event: string;
      properties: Record<string, unknown>;
    });

export function segmentWriteKey(): string | undefined {
  return (
    process.env.SEGMENT_WRITE_KEY ?? process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY
  );
}

export async function sendToSegment(
  writeKey: string,
  batch: SegmentMessage[]
): Promise<void> {
  const res = await fetch(BATCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${writeKey}:`).toString("base64")}`,
    },
    body: JSON.stringify({ batch }),
  });
  if (!res.ok) {
    throw new Error(`Segment batch failed: ${res.status} ${await res.text()}`);
  }
}
