from .stubs import sync_company_record

# !snippet:start
import datetime

import inngest

inngest_client = inngest.Inngest(app_id="customer-sync")


@inngest_client.create_function(
    fn_id="sync-company",
    trigger=inngest.TriggerEvent(event="company/updated"),
    rate_limit=inngest.RateLimit(
        limit=1,
        period=datetime.timedelta(hours=4),
        key="event.data.company_id",
    ),
)
async def sync_company(ctx: inngest.Context) -> None:
    async def run_sync() -> None:
        await sync_company_record(str(ctx.event.data["company_id"]))

    await ctx.step.run("sync-company-record", run_sync)


# !snippet:end
