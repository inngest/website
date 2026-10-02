from .stubs import inngest_client, record_sync_failure, sync_catalog_from_source

# !snippet:start
import inngest


async def handle_sync_failure(ctx: inngest.Context) -> None:
    error = ctx.event.data.get("error")
    message = error.get("message") if isinstance(error, dict) else None

    async def record() -> None:
        await record_sync_failure(
            failed_run_id=ctx.event.data["run_id"],
            message=message,
        )

    await ctx.step.run("record-sync-failure", record)


@inngest_client.create_function(
    fn_id="sync-catalog",
    trigger=inngest.TriggerEvent(event="catalog/sync.requested"),
    on_failure=handle_sync_failure,
)
async def sync_catalog(ctx: inngest.Context) -> None:
    async def sync() -> None:
        await sync_catalog_from_source(ctx.event.data)

    await ctx.step.run("sync-catalog", sync)


# !snippet:end
