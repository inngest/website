# !snippet:start
import datetime

import inngest
from inngest.experimental import realtime

from .client import inngest_client


@inngest_client.create_function(
    fn_id="show-progress",
    trigger=inngest.TriggerEvent(event="demo/progress.requested"),
)
async def show_progress(ctx: inngest.Context) -> None:
    channel = f"progress:{ctx.event.data['userId']}"

    # realtime.publish() isn't a durable step. Wrap it in ctx.step.run() so a
    # retry doesn't publish a completed message again.
    async def publish_started() -> None:
        await realtime.publish(
            client=inngest_client,
            channel=channel,
            topic="status",
            data={"message": "Started"},
        )

    async def publish_finished() -> None:
        await realtime.publish(
            client=inngest_client,
            channel=channel,
            topic="result",
            data={"message": "The work is complete."},
        )

    await ctx.step.run("started", publish_started)
    await ctx.step.sleep("demo-wait", datetime.timedelta(seconds=3))
    await ctx.step.run("finished", publish_finished)
# !snippet:end
