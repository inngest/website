import datetime

import inngest


async def fn(
    ctx: inngest.Context,
    step_id: str,
    name: str,
    timeout: datetime.timedelta,
    expression: str,
) -> None:
    # !snippet:start
    event = await ctx.step.wait_for_event(
        step_id, event=name, timeout=timeout, if_exp=expression
    )
    # !snippet:end
    print(event)
