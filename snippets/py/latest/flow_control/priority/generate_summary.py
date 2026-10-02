# !snippet:start
import inngest

inngest_client = inngest.Inngest(app_id="summaries")


@inngest_client.create_function(
    fn_id="generate-summary",
    trigger=inngest.TriggerEvent(event="ai/summary.requested"),
    concurrency=[inngest.Concurrency(limit=1)],
    priority=inngest.Priority(
        run="event.data.tier == 'enterprise' ? 120 : 0",
    ),
)
async def generate_summary(ctx: inngest.Context) -> dict[str, str]:
    async def record_request() -> dict[str, str]:
        return {"requestId": str(ctx.event.data["requestId"])}

    return await ctx.step.run("record-request", record_request)


# !snippet:end
