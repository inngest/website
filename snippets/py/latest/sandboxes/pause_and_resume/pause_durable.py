import datetime

import inngest


async def pause_and_resume(ctx: inngest.Context) -> str:
    # !snippet:start
    sandbox = await ctx.step.sandbox.create(
        "create-sandbox",
        name=f"paused-work-{ctx.event.data['jobId']}",
        vcpu=1,
        memory_mb=1024,
    )

    await sandbox.commands.run(
        "write-progress",
        "printf 'work in progress\\n' > /tmp/progress.txt",
    )

    paused = await sandbox.pause(
        "pause-sandbox", timeout=datetime.timedelta(minutes=5)
    )
    running = await paused.resume(
        "resume-sandbox", timeout=datetime.timedelta(minutes=5)
    )

    result = await running.commands.run(
        "read-progress",
        "cat /tmp/progress.txt",
    )

    await running.destroy("destroy-sandbox")
    return result.stdout
    # !snippet:end
