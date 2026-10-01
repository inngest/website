# !snippet:start
import time
import typing

import inngest

from .client import inngest_client
from .sub_agent import sub_agent


@inngest_client.create_function(
    fn_id="parent-agent",
    trigger=inngest.TriggerEvent(event="agent/task.received"),
)
async def parent_agent(ctx: inngest.Context) -> dict[str, typing.Any]:
    messages: list[dict[str, typing.Any]] = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]
    done = False
    i = 0

    while not done and i < 30:
        response = await ctx.step.run("think", call_llm, messages, TOOLS)

        for tool_call in response["tool_calls"]:
            if tool_call["name"] == "delegate_task":
                # Synchronous delegation — parent waits for the result
                session_id = ctx.event.data["sessionId"]
                sub_result = await ctx.step.invoke(
                    "sub-agent",
                    function=sub_agent,
                    data={
                        "task": tool_call["arguments"]["task"],
                        "sessionId": f"sub-{session_id}-{int(time.time() * 1000)}",
                    },
                )

                tool_result = str(
                    (sub_result or {}).get("response")
                    or "(no response from sub-agent)"
                )
            else:
                tool_result = await ctx.step.run(
                    f"tool-{tool_call['name']}",
                    execute_tool,
                    tool_call["name"],
                    tool_call["arguments"],
                )

            messages.extend(
                [
                    {
                        "role": "assistant",
                        "content": None,
                        "tool_calls": [tool_call],
                    },
                    {
                        "role": "tool",
                        "tool_call_id": tool_call["id"],
                        "content": tool_result,
                    },
                ]
            )

        if not response["tool_calls"]:
            done = True
        i += 1

    return {"response": messages[-1]["content"]}


# !snippet:end

from .stubs import SYSTEM_PROMPT, TOOLS, call_llm, execute_tool  # noqa: E402
