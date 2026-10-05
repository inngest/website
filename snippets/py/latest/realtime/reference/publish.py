import inngest
from inngest.experimental import realtime

from .client import inngest_client


async def handler(ctx: inngest.Context) -> None:
    job_id = ctx.event.data["jobId"]
    # !snippet:start
    channel = f"job:{job_id}"

    # Python has no durable publish step. Wrap the publish in
    # ctx.step.run() so a retry after it completes doesn't publish again.
    async def publish_complete() -> None:
        await realtime.publish(
            client=inngest_client,
            channel=channel,
            topic="status",
            data={"message": "Complete"},
        )

    await ctx.step.run("job-complete", publish_complete)

    # Immediate publish. Outside a step, it can repeat on replay.
    await realtime.publish(
        client=inngest_client,
        channel=channel,
        topic="status",
        data={"message": "Processing"},
    )
    # !snippet:end
