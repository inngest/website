# !snippet:start
# Requires the inngest release after 0.5.19.
import inngest

from .stubs import generate_answer, validate_answer

inngest_client = inngest.Inngest(app_id="support-agent")


@inngest_client.create_function(
    fn_id="answer-support-ticket",
    trigger=inngest.TriggerEvent(event="support/ticket.created"),
)
async def answer_support_ticket(ctx: inngest.Context) -> str:
    message = str(ctx.event.data["message"])

    async def generate() -> str:
        return await generate_answer(message)

    answer = await ctx.step.run("generate-answer", generate)

    # Wrap the score write in a step so a retry or replay doesn't record
    # it twice. Pass the run ID explicitly.
    async def score_answer() -> None:
        await inngest_client.score(
            name="answer-valid",
            value=validate_answer(answer),
            run_id=ctx.run_id,
        )

    await ctx.step.run("score-answer-valid", score_answer)

    return answer
# !snippet:end
