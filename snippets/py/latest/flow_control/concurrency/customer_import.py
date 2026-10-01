import inngest

from .stubs import process_file

inngest_client = inngest.Inngest(app_id="imports")


# !snippet:start
@inngest_client.create_function(
    fn_id="process-customer-import",
    trigger=inngest.TriggerEvent(event="csv/file.uploaded"),
    concurrency=[
        inngest.Concurrency(limit=1, key="event.data.customerId"),
    ],
)
async def process_customer_import(ctx: inngest.Context) -> None:
    async def run_process_file() -> None:
        await process_file(str(ctx.event.data["fileURI"]))

    await ctx.step.run("process-file", run_process_file)


# !snippet:end
