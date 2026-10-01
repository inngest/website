# !snippet:start
import datetime

import inngest

inngest_client = inngest.Inngest(app_id="my-app")


@inngest_client.create_function(
    fn_id="summarize",
    trigger=inngest.TriggerEvent(event="ai/summary.requested"),
    throttle=inngest.Throttle(
        limit=1,
        period=datetime.timedelta(seconds=5),
        burst=2,
        key="event.data.user_id",
    ),
)
async def summarize(ctx: inngest.Context) -> dict[str, object]:
    async def record_request() -> dict[str, object]:
        return {
            "userId": str(ctx.event.data["user_id"]),
            "textLength": len(str(ctx.event.data["text"])),
        }

    return await ctx.step.run("record-request", record_request)


# !snippet:end
