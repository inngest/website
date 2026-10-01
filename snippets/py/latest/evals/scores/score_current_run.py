# !snippet:start
# Requires the inngest release after 0.5.19.
import inngest

from .stubs import is_valid_answer, write_answer

inngest_client = inngest.Inngest(app_id="support")


@inngest_client.create_function(
    fn_id="answer-ticket",
    trigger=inngest.TriggerEvent(event="support/ticket.created"),
)
async def answer_ticket(ctx: inngest.Context) -> str:
    message = str(ctx.event.data["message"])

    async def write() -> str:
        return await write_answer(message)

    answer = await ctx.step.run("write-answer", write)

    # Python has no step.score(). Write the score inside a step so a retry
    # or replay reuses the recorded write instead of scoring again.
    async def score_format() -> None:
        await inngest_client.score(
            name="format-valid",
            value=is_valid_answer(answer),
            run_id=ctx.run_id,
        )

    await ctx.step.run("score-format-valid", score_format)

    return answer
# !snippet:end
