import inngest

inngest_client = inngest.Inngest(app_id="my-app")


# !snippet:start
@inngest_client.create_function(
    fn_id="generate-ai-summary",
    concurrency=[
        inngest.Concurrency(
            limit=10,
        )
    ],
    trigger=inngest.TriggerEvent(event="ai/summary.requested"),
)
async def generate_ai_summary(ctx: inngest.Context):
    # Your function handler here
    pass
