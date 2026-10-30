import datetime

import inngest


async def run_tests(ctx: inngest.Context) -> int:
    # !snippet:start
    sandbox = await ctx.step.sandbox.create(
        "create-sandbox",
        name=f"job-{ctx.event.data['jobId']}",
        vcpu=1,
        memory_mb=1024,
    )

    result = await sandbox.commands.run(
        "run-tests",
        ["npm", "test"],
        cwd="/workspace/repo",
        timeout=datetime.timedelta(minutes=5),
    )

    await sandbox.destroy("destroy-sandbox")
    # !snippet:end
    return result.exit_code
