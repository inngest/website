# !snippet:start
# Requires the inngest release after 0.5.19.
import inngest
from inngest.experimental import experiment

from .client import inngest_client
from .stubs import summarize


@inngest_client.create_function(
    fn_id="summarize-document",
    trigger=inngest.TriggerEvent(event="docs/summary.requested"),
)
async def summarize_document(ctx: inngest.Context) -> dict[str, str]:
    text = str(ctx.event.data["text"])

    async def summarize_current() -> str:
        return await summarize(model="current-model", text=text)

    async def summarize_candidate() -> str:
        return await summarize(model="candidate-model", text=text)

    res = await ctx.group.experiment(
        "summary-model",
        variants={
            "current": lambda: ctx.step.run(
                "summarize-current", summarize_current
            ),
            "candidate": lambda: ctx.step.run(
                "summarize-candidate", summarize_candidate
            ),
        },
        # Python has no weighted selector. Bucketing on the run ID gives
        # each new run an independent 90/10 split that survives retries.
        select=experiment.bucket(
            ctx.run_id, weights={"current": 90, "candidate": 10}
        ),
    )

    # Score in a step so a replay doesn't send the score again.
    async def score_summary() -> None:
        await inngest_client.score_experiment(
            name="summary-under-limit",
            value=len(res.result) <= 500,
            experiment=res.experiment_ref,
            run_id=ctx.run_id,
        )

    await ctx.step.run("score-summary-under-limit", score_summary)

    return {"variant": res.variant, "summary": res.result}
# !snippet:end
