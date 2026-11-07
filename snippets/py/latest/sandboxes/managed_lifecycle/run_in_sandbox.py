# !snippet:start
# Requires inngest 0.5.20 or newer.
import datetime

import inngest

inngest_client = inngest.Inngest(app_id="sandbox-lifecycle")


@inngest_client.create_function(
    fn_id="run-in-sandbox",
    trigger=inngest.TriggerEvent(event="sandbox/job.requested"),
)
async def run_in_sandbox(ctx: inngest.Context) -> dict[str, object]:
    sandbox = await ctx.step.sandbox.create(
        "create-sandbox",
        name=f"job-{ctx.event.data['jobId']}",
        vcpu=1,
        memory_mb=1024,
        running_timeout=datetime.timedelta(seconds=60),
    )

    result = await sandbox.commands.run(
        "run-command",
        ["node", "-e", "console.log('done')"],
        timeout=datetime.timedelta(seconds=30),
    )

    await sandbox.destroy("destroy-sandbox")

    return {"exitCode": result.exit_code, "stdout": result.stdout}


# !snippet:end
