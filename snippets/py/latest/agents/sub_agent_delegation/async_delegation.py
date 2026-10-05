import time
import typing

import inngest


async def async_delegation(
    ctx: inngest.Context, tool_call: dict[str, typing.Any]
) -> str:
    tool_result = ""
    # !snippet:start
    if tool_call["name"] == "delegate_background_task":
        session_id = ctx.event.data["sessionId"]
        await ctx.step.send_event(
            "spawn-background-task",
            inngest.Event(
                name="agent/sub-agent.spawn",
                data={
                    "task": tool_call["arguments"]["task"],
                    "sessionId": f"sub-{session_id}-{int(time.time() * 1000)}",
                    "isAsync": True,
                    "replyTo": {
                        "type": "webhook",
                        "url": ctx.event.data["callbackUrl"],
                    },
                },
            ),
        )

        tool_result = (
            "Task delegated. The sub-agent is working on it in the background."
        )
    # !snippet:end
    return tool_result
