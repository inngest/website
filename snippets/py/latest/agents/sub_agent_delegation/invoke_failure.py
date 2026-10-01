import typing

import inngest

from .sub_agent import sub_agent


async def invoke_failure(
    ctx: inngest.Context, tool_call: dict[str, typing.Any], sub_session_id: str
) -> str:
    # !snippet:start
    try:
        sub_result = await ctx.step.invoke(
            "sub-agent",
            function=sub_agent,
            data={
                "task": tool_call["arguments"]["task"],
                "sessionId": sub_session_id,
            },
        )
        tool_result = str(
            (sub_result or {}).get("response") or "(no response)"
        )
    except inngest.StepError as err:
        tool_result = (
            f"Sub-agent failed: {err.message}. "
            "You may need to handle this task directly."
        )
    # !snippet:end
    return tool_result
