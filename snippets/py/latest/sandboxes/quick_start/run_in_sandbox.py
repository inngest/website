# !snippet:start
import datetime

import inngest

from .client import inngest_client


@inngest_client.create_function(
    fn_id="run-in-sandbox",
    trigger=inngest.TriggerEvent(event="sandbox/demo.requested"),
)
async def run_in_sandbox(ctx: inngest.Context) -> dict[str, object]:
    sandbox = await ctx.step.sandbox.create(
        "create-sandbox",
        name=f"beta-{ctx.event.data['jobId']}",
        vcpu=1,
        memory_mb=1024,
    )

    result = await sandbox.commands.run(
        "run-command",
        "printf 'hello from the sandbox\\n'; printf 'diagnostic\\n' >&2",
        cwd="/",
        timeout=datetime.timedelta(seconds=30),
    )

    await sandbox.destroy("destroy-sandbox")

    return {
        "sandboxId": sandbox.id,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "exitCode": result.exit_code,
        "outputWasTruncated": result.output.truncated,
    }


# !snippet:end
