import datetime

import inngest


async def run_traced(ctx: inngest.Context) -> dict[str, object]:
    # !snippet:start
    sandbox = await ctx.step.sandbox.create(
        "create-sandbox",
        name=f"trace-{ctx.event.data['jobId']}",
        vcpu=1,
        memory_mb=1024,
    )

    result = await sandbox.commands.run(
        "run-command",
        "printf 'hello from the sandbox\\n'",
        timeout=datetime.timedelta(seconds=30),
    )

    await sandbox.destroy("destroy-sandbox")

    return {
        "sandboxId": sandbox.id,
        "exitCode": result.exit_code,
        "stdout": result.stdout,
    }
    # !snippet:end
