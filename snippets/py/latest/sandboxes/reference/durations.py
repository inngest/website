import datetime

import inngest


async def durations(ctx: inngest.Context) -> None:
    sandbox = await ctx.step.sandbox.create(
        "build",
        name="build",
        vcpu=2,
        memory_mb=2048,
        running_timeout=datetime.timedelta(minutes=4, seconds=30),
    )

    await sandbox.commands.run(
        "test", "npm test", timeout=datetime.timedelta(minutes=5)
    )
    await sandbox.commands.run("test", "npm test", timeout=90_000)  # ms
