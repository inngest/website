import typing

import inngest


async def result_event(
    ctx: inngest.Context, result: dict[str, typing.Any]
) -> None:
    is_async = ctx.event.data.get("isAsync")
    session_id = ctx.event.data["sessionId"]
    # !snippet:start
    # Sub-agent emits result as an event
    if is_async:
        await ctx.step.send_event(
            "result-ready",
            inngest.Event(
                name="agent/sub-agent.completed",
                data={
                    "sessionId": session_id,
                    "parentSessionId": ctx.event.data["parentSessionId"],
                    "response": result["response"],
                },
            ),
        )
    # !snippet:end
