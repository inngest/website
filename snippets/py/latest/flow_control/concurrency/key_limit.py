import inngest

inngest_client = inngest.Inngest(app_id="imports")


@inngest_client.create_function(
    fn_id="process-import",
    trigger=inngest.TriggerEvent(event="imports/requested"),
    # !snippet:start
    concurrency=[
        inngest.Concurrency(limit=2, key="event.data.accountId"),
    ],
    # !snippet:end
)
async def process_import(ctx: inngest.Context) -> None:
    pass
