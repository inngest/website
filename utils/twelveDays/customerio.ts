import type { EmailKind } from "@/utils/twelveDays/client";

/**
 * Sends 12 Days emails with Customer.io's transactional API. Inngest
 * decides who gets what and when (doors.ts); Customer.io owns the
 * templates, delivery and unsubscribes.
 *
 * - `CUSTOMERIO_APP_API_KEY`: an App API key.
 * - `CUSTOMERIO_12DOW_DOOR_MESSAGE_ID` / `CUSTOMERIO_12DOW_NUDGE_MESSAGE_ID`:
 *   the transactional message ids for "Day N is open" and the evening
 *   nudge.
 * - `CUSTOMERIO_API_HOST`: only for an EU workspace
 *   (`https://api-eu.customer.io`).
 */

const MESSAGE_ID_ENV: Record<EmailKind, string> = {
  door: "CUSTOMERIO_12DOW_DOOR_MESSAGE_ID",
  nudge: "CUSTOMERIO_12DOW_NUDGE_MESSAGE_ID",
};

export interface TransactionalEmail {
  kind: EmailKind;
  to: string;
  /** Customer.io person id: the Inngest user id, as in Segment. */
  userId: string;
  /** Liquid variables for the template (`{{ trigger.day }}` etc.). */
  data: Record<string, unknown>;
}

/**
 * Sends one email. Returns why it was skipped when Customer.io isn't
 * configured yet, so runs before setup say so instead of failing.
 */
export async function sendTransactional(
  email: TransactionalEmail
): Promise<string> {
  const apiKey = process.env.CUSTOMERIO_APP_API_KEY;
  const messageId = process.env[MESSAGE_ID_ENV[email.kind]];
  if (!apiKey || !messageId) {
    return `skipped: ${
      apiKey ? MESSAGE_ID_ENV[email.kind] : "CUSTOMERIO_APP_API_KEY"
    } is not set`;
  }

  const host = process.env.CUSTOMERIO_API_HOST ?? "https://api.customer.io";
  const res = await fetch(`${host}/v1/send/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      transactional_message_id: messageId,
      to: email.to,
      identifiers: { id: email.userId },
      message_data: email.data,
      // Campaign mail, not a receipt: respect unsubscribes.
      send_to_unsubscribed: false,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `Customer.io send failed: ${res.status} ${await res.text()}`
    );
  }
  const { delivery_id } = (await res.json()) as { delivery_id?: string };
  return `sent ${delivery_id ?? ""}`.trim();
}
