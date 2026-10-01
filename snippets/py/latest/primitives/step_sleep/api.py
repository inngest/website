import datetime

import inngest


async def fn(
    ctx: inngest.Context, step_id: str, duration: datetime.timedelta
) -> None:
    # !snippet:start
    await ctx.step.sleep(step_id, duration)
    # !snippet:end
