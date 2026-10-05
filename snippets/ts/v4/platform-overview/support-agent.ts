import { Inngest, experiment, realtime } from "inngest";
import { sandboxMiddleware } from "inngest/experimental";
import { z } from "zod";

const inngest = new Inngest({
  id: "support-app",
  middleware: [sandboxMiddleware()],
});

declare function loadTicketContext(
  ticketId: string
): Promise<{ history: string[] }>;
declare function draftAnswer(
  context: { history: string[] },
  style: "concise" | "detailed"
): Promise<string>;
declare function sendReply(ticketId: string, answer: string): Promise<void>;

// !snippet:start
const ticketChannel = realtime.channel({
  name: ({ ticketId }: { ticketId: string }) => `ticket:${ticketId}`,
  topics: { status: { schema: z.object({ message: z.string() }) } },
});

export const answerTicket = inngest.createFunction(
  { id: "answer-ticket", triggers: { event: "support/ticket.created" } },
  async ({ event, step, group }) => {
    const { ticketId } = event.data;
    const channel = ticketChannel({ ticketId });

    // Each step's result is saved. A retry skips steps that already finished.
    const context = await step.run("load-context", () =>
      loadTicketContext(ticketId)
    );

    // Pick variant A or B, then draft the answer with that strategy.
    const { result: answer } = await group.experiment("answer-style", {
      variants: {
        concise: () =>
          step.run("draft-concise", () => draftAnswer(context, "concise")),
        detailed: () =>
          step.run("draft-detailed", () => draftAnswer(context, "detailed")),
      },
      select: experiment.weighted({ concise: 50, detailed: 50 }),
    });

    // Stream progress to the customer's browser.
    await step.realtime.publish("drafted", channel.status, {
      message: "Checking your account…",
    });

    // Run diagnostics in an isolated Sandbox.
    const sandbox = await step.sandbox.create("create-sandbox", {
      name: `diagnose-${ticketId}`,
      vcpu: 1,
      memoryMb: 1024,
    });
    const diagnostics = await sandbox.commands.run(
      "run-diagnostics",
      "./diagnose.sh",
      { timeout: "30s" }
    );
    await sandbox.destroy("destroy-sandbox");

    await step.run("send-reply", () =>
      sendReply(ticketId, `${answer}\n\n${diagnostics.stdout}`)
    );
  }
);
// !snippet:end
