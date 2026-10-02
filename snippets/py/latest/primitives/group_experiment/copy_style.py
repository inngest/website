import inngest

from .stubs import analytics, generate_detailed_copy, generate_short_copy


async def fn(ctx: inngest.Context) -> str:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    from inngest.experimental import experiment

    res = await ctx.group.experiment(
        "copy-style",
        variants={
            "short": lambda: ctx.step.run(
                "short-copy", generate_short_copy, ctx.event.data
            ),
            "detailed": lambda: ctx.step.run(
                "detailed-copy", generate_detailed_copy, ctx.event.data
            ),
        },
        select=experiment.bucket(
            str(ctx.event.data["userId"]),
            weights={"short": 50, "detailed": 50},
        ),
    )

    async def track() -> None:
        await analytics.track(
            "experiment.variant_selected",
            {
                "experiment": "copy-style",
                "variant": res.variant,
                "userId": ctx.event.data["userId"],
            },
        )

    await ctx.step.run("track-experiment", track)

    return res.result
    # !snippet:end
