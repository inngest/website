# !snippet:start
import inngest

inngest_client = inngest.Inngest(app_id="imports")


@inngest_client.create_function(
    fn_id="process-import",
    trigger=inngest.TriggerEvent(event="imports/requested"),
    concurrency=[inngest.Concurrency(limit=10)],
)
async def process_import(ctx: inngest.Context) -> str:
    async def normalize_import_id() -> str:
        return str(ctx.event.data["importId"]).upper()

    return await ctx.step.run("normalize-import-id", normalize_import_id)


# !snippet:end
