import inngest
from inngest.experimental import experiment

from .stubs import summarize


async def bucket_example(ctx: inngest.Context) -> None:
    async def current() -> str:
        return await summarize(model="current-model", text="")

    async def candidate() -> str:
        return await summarize(model="candidate-model", text="")

    await ctx.group.experiment(
        "summary-model",
        variants={
            "current": lambda: ctx.step.run("summarize-current", current),
            "candidate": lambda: ctx.step.run("summarize-candidate", candidate),
        },
        # !snippet:start
        select=experiment.bucket(
            str(ctx.event.data["accountId"]),
            weights={"current": 80, "candidate": 20},
        ),
        # !snippet:end
    )


async def fixed_example(ctx: inngest.Context) -> None:
    async def current() -> str:
        return await summarize(model="current-model", text="")

    async def candidate() -> str:
        return await summarize(model="candidate-model", text="")

    await ctx.group.experiment(
        "summary-model",
        variants={
            "current": lambda: ctx.step.run("summarize-current", current),
            "candidate": lambda: ctx.step.run("summarize-candidate", candidate),
        },
        select=experiment.fixed("candidate"),
    )
