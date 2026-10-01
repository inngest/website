import datetime
import typing

import inngest


async def fn(
    ctx: inngest.Context,
    step_id: str,
    function: inngest.Function[typing.Any],
    data: dict[str, object],
    timeout: datetime.timedelta,
) -> None:
    # !snippet:start
    result = await ctx.step.invoke(
        step_id, function=function, data=data, timeout=timeout
    )

    # To call a function in another app, use its IDs:
    result = await ctx.step.invoke_by_id(
        step_id, app_id="other-app", function_id="other-fn", data=data
    )
    # !snippet:end
    print(result)
