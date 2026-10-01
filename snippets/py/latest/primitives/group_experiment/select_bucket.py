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
        select=experiment.bucket(
            str(ctx.event.data["userId"]),
            weights={"control": 80, "candidate": 20},
        ),
        # !snippet:end
    )
