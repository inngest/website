import inngest

from .stubs import bucket

inngest_client = inngest.Inngest(app_id="imports")


# !snippet:start
@inngest_client.create_function(
    name="Process customer csv import",
    fn_id="process-customer-csv-import",
    concurrency=[
        inngest.Concurrency(
            limit=1,
            # You can use any piece of data from the event payload
            key="event.data.customerId",
        ),
    ],
    trigger=inngest.TriggerEvent(event="csv/file.uploaded"),
)
async def send(ctx: inngest.Context) -> dict[str, str]:
    async def process_file() -> None:
        file = await bucket.fetch(str(ctx.event.data["fileURI"]))
        ctx.logger.info("fetched %d bytes", len(file))
        # ...

    await ctx.step.run("process-file", process_file)

    return {"message": "success"}


# !snippet:end
