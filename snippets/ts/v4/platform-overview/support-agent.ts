import { Inngest, realtime } from "inngest";
import { z } from "zod";

const inngest = new Inngest({ id: "support-app" });

declare function loadTicketContext(
  ticketId: string
): Promise<{ history: string[] }>;
declare function draftAnswer(context: { history: string[] }): Promise<string>;
declare function sendReply(ticketId: string, answer: string): Promise<void>;

// !snippet:start
const ticketChannel = realtime.channel({
  name: ({ ticketId }: { ticketId: string }) => `ticket:${ticketId}`,
  topics: { status: { schema: z.object({ message: z.string() }) } },
});

export const answerTicket = inngest.createFunction(
  { id: "answer-ticket", triggers: { event: "support/ticket.created" } },
  async ({ event, step }) => {
    const { ticketId } = event.data;
    const channel = ticketChannel({ ticketId });

    // Each step's result is saved. A retry skips steps that already finished.
    const context = await step.run("load-context", () =>
      loadTicketContext(ticketId)
    );

    const answer = await step.run("draft-answer", () => draftAnswer(context));

    // Stream progress to the customer's browser.
    await step.realtime.publish("drafted", channel.status, {
      message: "Sending your answer…",
    });

    await step.run("send-reply", () => sendReply(ticketId, answer));
  }
);
// !snippet:end
