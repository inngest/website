import datetime

import inngest

inngest_client = inngest.Inngest(app_id="activity")


@inngest_client.create_function(
    fn_id="record-activity",
    trigger=inngest.TriggerEvent(event="activity/recorded"),
    # !snippet:start
    batch_events=inngest.Batch(
        max_size=5,
        timeout=datetime.timedelta(seconds=5),
        key="event.data.accountId",
    ),
    concurrency=[
        inngest.Concurrency(limit=1, key="event.data.accountId"),
    ],
    # !snippet:end
)
async def record_activity(ctx: inngest.Context) -> None:
    pass
