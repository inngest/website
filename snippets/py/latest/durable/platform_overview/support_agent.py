# !snippet:start
import inngest
from inngest.experimental import realtime

from .stubs import draft_answer, load_ticket_context, send_reply

inngest_client = inngest.Inngest(app_id="support-app")


@inngest_client.create_function(
    fn_id="answer-ticket",
    trigger=inngest.TriggerEvent(event="support/ticket.created"),
)
async def answer_ticket(ctx: inngest.Context) -> None:
    ticket_id = str(ctx.event.data["ticketId"])

    # Each step's result is saved. A retry skips steps that already finished.
    async def load_context() -> dict[str, list[str]]:
        return await load_ticket_context(ticket_id)

    context = await ctx.step.run("load-context", load_context)

    async def draft() -> str:
        return await draft_answer(context)

    answer = await ctx.step.run("draft-answer", draft)

    # Stream progress to the customer's browser.
    async def publish_status() -> None:
        await realtime.publish(
            client=inngest_client,
            channel=f"ticket:{ticket_id}",
            topic="status",
            data={"message": "Sending your answer…"},
        )

    await ctx.step.run("drafted", publish_status)

    async def reply() -> None:
        await send_reply(ticket_id, answer)

    await ctx.step.run("send-reply", reply)


# !snippet:end
