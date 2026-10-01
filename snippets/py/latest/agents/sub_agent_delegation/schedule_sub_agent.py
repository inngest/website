import datetime
import time

import inngest

from .stubs import REPORT_WEBHOOK_URL


async def schedule_sub_agent(
    ctx: inngest.Context, tomorrow_9am: datetime.datetime
) -> None:
    # !snippet:start
    await ctx.step.send_event(
        "schedule-daily-report",
        inngest.Event(
            name="agent/sub-agent.spawn",
            data={
                "task": "Generate the daily analytics summary report.",
                "sessionId": f"scheduled-{int(time.time() * 1000)}",
                "isAsync": True,
                "replyTo": {"type": "webhook", "url": REPORT_WEBHOOK_URL},
            },
            ts=int(tomorrow_9am.timestamp() * 1000),
        ),
    )
    # !snippet:end
