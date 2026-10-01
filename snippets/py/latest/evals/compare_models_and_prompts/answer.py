# !snippet:start
# Requires the inngest release after 0.5.19.
import inngest
from inngest.experimental import experiment

from .client import inngest_client
from .scorers import feedback_scorer
from .stubs import (
    CONCISE_PROMPT,
    DETAILED_PROMPT,
    answer,
    is_valid_answer,
    send_reply,
)


@inngest_client.create_function(
    fn_id="answer-ticket",
    trigger=inngest.TriggerEvent(event="support/ticket.created"),
)
async def answer_ticket(ctx: inngest.Context) -> str:
    ticket = ctx.event.data
    ticket_id = str(ticket["ticketId"])

    async def answer_concise() -> str:
        return await answer(prompt=CONCISE_PROMPT, ticket=ticket)

    async def answer_detailed() -> str:
        return await answer(prompt=DETAILED_PROMPT, ticket=ticket)

    res = await ctx.group.experiment(
        "answer-style",
        variants={
            "concise": lambda: ctx.step.run("answer-concise", answer_concise),
            "detailed": lambda: ctx.step.run(
                "answer-detailed", answer_detailed
            ),
        },
        select=experiment.bucket(
            str(ticket["accountId"]),
            weights={"concise": 50, "detailed": 50},
        ),
    )
    reply = res.result

    async def send() -> None:
        await send_reply(ticket_id, reply)

    await ctx.step.run("send-answer", send)

    # Immediate check, credited to the variant.
    async def score_valid() -> None:
        await inngest_client.score_experiment(
            name="answer-valid",
            value=is_valid_answer(reply),
            experiment=res.experiment_ref,
            run_id=ctx.run_id,
        )

    await ctx.step.run("score-answer-valid", score_valid)

    # Later outcome, credited to the same variant.
    ctx.defer(
        "score-feedback",
        function=feedback_scorer,
        data={"ticketId": ticket_id},
        experiment=res.experiment_ref,
    )

    return reply
# !snippet:end
