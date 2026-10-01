# !snippet:start
import datetime

import inngest

inngest_client = inngest.Inngest(app_id="activity")


@inngest_client.create_function(
    fn_id="record-activity",
    trigger=inngest.TriggerEvent(event="activity/recorded"),
    batch_events=inngest.Batch(
        max_size=5,
        timeout=datetime.timedelta(seconds=5),
        key="event.data.accountId",
    ),
)
async def record_activity(ctx: inngest.Context) -> int:
    rows = [
        {
            "accountId": str(evt.data["accountId"]),
            "action": str(evt.data["action"]),
        }
        for evt in ctx.events
    ]

    async def write_batch() -> int:
        ctx.logger.info(rows)
        return len(rows)

    return await ctx.step.run("write-batch", write_batch)


# !snippet:end
