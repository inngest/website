# !snippet:start
# Requires the inngest release after 0.5.19 (for group.experiment).
import inngest
from inngest.experimental import experiment, realtime

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

    async def draft_concise() -> str:
        return await draft_answer(context, "concise")

    async def draft_detailed() -> str:
        return await draft_answer(context, "detailed")

    # Pick variant A or B, then draft the answer with that strategy.
    selected = await ctx.group.experiment(
        "answer-style",
        variants={
            "concise": lambda: ctx.step.run("draft-concise", draft_concise),
            "detailed": lambda: ctx.step.run("draft-detailed", draft_detailed),
        },
        select=experiment.bucket(
            ctx.run_id, weights={"concise": 50, "detailed": 50}
        ),
    )
    answer = str(selected.result)

    # Stream progress to the customer's browser.
    async def publish_status() -> None:
        await realtime.publish(
            client=inngest_client,
            channel=f"ticket:{ticket_id}",
            topic="status",
            data={"message": "Checking your account…"},
        )

    await ctx.step.run("drafted", publish_status)

    # Sandboxes aren't available in Python yet, so this version skips the
    # diagnostics step.
    async def reply() -> None:
        await send_reply(ticket_id, answer)

    await ctx.step.run("send-reply", reply)


# !snippet:end
