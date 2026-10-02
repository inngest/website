from .stubs import build_report, inngest_client

# !snippet:start
import datetime

import inngest


@inngest_client.create_function(
    fn_id="create-report",
    trigger=inngest.TriggerEvent(event="reports/created"),
    timeouts=inngest.Timeouts(
        start=datetime.timedelta(minutes=10),
        finish=datetime.timedelta(hours=1),
    ),
)
async def create_report(ctx: inngest.Context) -> None:
    async def build() -> None:
        await build_report(ctx.event.data["reportId"])

    await ctx.step.run("build-report", build)


# !snippet:end
