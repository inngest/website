# !snippet:start
import datetime

import inngest

inngest_client = inngest.Inngest(app_id="customer-sync")


@inngest_client.create_function(
    fn_id="sync-company",
    trigger=inngest.TriggerEvent(event="company/updated"),
    debounce=inngest.Debounce(
        key="event.data.account_id",
        period=datetime.timedelta(minutes=5),
        timeout=datetime.timedelta(minutes=10),
    ),
)
async def sync_company(ctx: inngest.Context) -> None:
    async def process_latest_update() -> None:
        ctx.logger.info(ctx.event.data["account_id"])

    await ctx.step.run("process-latest-update", process_latest_update)


# !snippet:end
