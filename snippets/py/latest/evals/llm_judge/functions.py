# !snippet:start
# Requires the inngest release after 0.5.19.
import inngest

from .agent import run_agent
from .client import inngest_client
from .judge import Score
from .rubrics import score_conciseness, score_helpfulness
from .tool_efficiency import score_tool_efficiency


# Python has no step.score(). Write each score in its own step so a retry
# doesn't record it twice.
async def step_score(ctx: inngest.Context, step_id: str, score: Score) -> None:
    async def write() -> None:
        await inngest_client.score(
            name=score["name"], value=score["value"], run_id=ctx.run_id
        )

    await ctx.step.run(step_id, write)


@inngest_client.create_function(
    fn_id="run-agent",
    trigger=inngest.TriggerEvent(event="agent/run.requested"),
)
async def run_agent_fn(ctx: inngest.Context) -> str:
    prompt = str(ctx.event.data["prompt"])
    result = await run_agent(ctx, prompt)
    answer = result["answer"]

    await step_score(
        ctx, "score-conciseness", await score_conciseness(ctx, prompt, answer)
    )
    await step_score(
        ctx, "score-helpfulness", await score_helpfulness(ctx, prompt, answer)
    )
    await step_score(
        ctx,
        "score-tool-efficiency",
        score_tool_efficiency(result["tool_calls"]),
    )

    return answer
# !snippet:end
