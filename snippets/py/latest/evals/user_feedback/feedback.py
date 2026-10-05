# !snippet:start
# Requires the inngest release after 0.5.19.
import inngest

from .client import inngest_client
from .stubs import db


@inngest_client.create_function(
    fn_id="score-rating",
    trigger=inngest.TriggerEvent(event="agent/response.rated"),
)
async def score_rating(ctx: inngest.Context) -> None:
    answer_id = str(ctx.event.data["answerId"])

    async def load_answer() -> dict[str, str]:
        return await db.answers.get(answer_id)

    saved = await ctx.step.run("load-answer", load_answer)

    await inngest_client.score(
        name="human-feedback",
        value=ctx.event.data["rating"] == "up",
        run_id=saved["run_id"],
    )
# !snippet:end
