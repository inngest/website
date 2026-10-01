# !snippet:start
import datetime

import inngest

inngest_client = inngest.Inngest(app_id="tenant-sync")


@inngest_client.create_function(
    fn_id="sync-tenant-data",
    trigger=inngest.TriggerEvent(event="app/tenant.sync.requested"),
    concurrency=[
        inngest.Concurrency(key="event.data.tenant_id", limit=5),
    ],
    throttle=inngest.Throttle(
        key="event.data.tenant_id",
        limit=100,
        period=datetime.timedelta(minutes=1),
    ),
)
async def sync_tenant(ctx: inngest.Context) -> None:
    async def sync_data() -> None:
        ctx.logger.info(ctx.event.data["tenant_id"])

    await ctx.step.run("sync-data", sync_data)


# !snippet:end
