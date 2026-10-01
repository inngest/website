from .stubs import build_report, inngest_client

# !snippet:start
import inngest

# Assumes `inngest_client` is your client and `build_report` is defined
# elsewhere.


@inngest_client.create_function(
    fn_id="daily-report",
    trigger=inngest.TriggerCron(cron="0 9 * * *"),
)
async def daily_report(ctx: inngest.Context) -> object:
    return await ctx.step.run("build-report", build_report)


# !snippet:end
