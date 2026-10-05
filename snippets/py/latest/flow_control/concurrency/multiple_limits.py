import inngest

inngest_client = inngest.Inngest(app_id="imports")


@inngest_client.create_function(
    fn_id="process-import",
    trigger=inngest.TriggerEvent(event="imports/requested"),
    # !snippet:start
    concurrency=[
        inngest.Concurrency(
            scope="account",
            key='"external-api"',
            limit=20,
        ),
        inngest.Concurrency(key="event.data.accountId", limit=2),
    ],
    # !snippet:end
)
async def process_import(ctx: inngest.Context) -> None:
    pass
