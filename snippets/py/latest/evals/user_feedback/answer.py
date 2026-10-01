# !snippet:start
import inngest

from .client import inngest_client
from .stubs import db, run_agent


@inngest_client.create_function(
    fn_id="answer-question",
    trigger=inngest.TriggerEvent(event="agent/question.asked"),
)
async def answer_question(ctx: inngest.Context) -> dict[str, str]:
    question = str(ctx.event.data["question"])
    answer_id = str(ctx.event.data["answerId"])

    async def answer_step() -> str:
        return await run_agent(question)

    answer = await ctx.step.run("answer", answer_step)

    async def save_answer() -> None:
        await db.answers.insert(id=answer_id, run_id=ctx.run_id, answer=answer)

    await ctx.step.run("save-answer", save_answer)
    return {"answer": answer, "runId": ctx.run_id}
# !snippet:end
