import inngest
from inngest.experimental import experiment


async def fn(ctx: inngest.Context) -> None:
    async def control() -> str:
        return await ctx.step.run("control", _noop)

    async def _noop() -> str:
        return ""

    await ctx.group.experiment(
        "x",
        variants={"control": control, "candidate": control},
        # !snippet:start
        # Requires the inngest release after 0.5.19.
        # Python has no weighted(). Bucket on the run ID for a per-run split.
        select=experiment.bucket(
            ctx.run_id, weights={"control": 90, "candidate": 10}
        ),
        # !snippet:end
    )
