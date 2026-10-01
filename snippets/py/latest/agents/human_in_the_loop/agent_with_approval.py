# !snippet:start
import datetime
import json
import typing

import inngest

inngest_client = inngest.Inngest(app_id="my-app")

APPROVAL_REQUIRED_TOOLS = ["send_email", "delete_record", "run_sql", "deploy"]


@inngest_client.create_function(
    fn_id="agent-with-approval",
    trigger=inngest.TriggerEvent(event="agent/task.received"),
)
async def agent_with_approval(ctx: inngest.Context) -> dict[str, typing.Any]:
    messages: list[dict[str, typing.Any]] = [
        {"role": "user", "content": ctx.event.data["task"]}
    ]
    iterations = 0

    while iterations < 20:
        iterations += 1

        llm_response = await ctx.step.run(
            "think", call_llm, messages, all_tools
        )

        if not llm_response["tool_calls"]:
            return {"response": llm_response["text"], "iterations": iterations}

        for tool_call in llm_response["tool_calls"]:
            name = tool_call["name"]
            if name in APPROVAL_REQUIRED_TOOLS:
                # Create a unique approval ID that will not be re-used
                approval_id = f"{ctx.event.data['taskId']}-{iterations}-{name}"

                async def request_approval() -> None:
                    args = json.dumps(tool_call["arguments"], indent=2)
                    await send_slack_message(
                        channel="#agent-approvals",
                        text="\n".join(
                            [
                                f"🔒 *Agent wants to execute: `{name}`*",
                                f"```{args}```",
                            ]
                        ),
                    )

                await ctx.step.run(
                    f"request-approval-{approval_id}", request_approval
                )

                approval = await ctx.step.wait_for_event(
                    f"wait-approval-{approval_id}",
                    event="agent/approval.response",
                    if_exp="async.data.approvalId == event.data.approvalId",
                    timeout=datetime.timedelta(hours=4),
                )

                if approval is None or not approval.data.get("approved"):
                    reason = (
                        approval and approval.data.get("reason")
                    ) or "No response / timed out"
                    messages.append(
                        {
                            "role": "tool",
                            "content": (
                                "Tool call rejected by human reviewer. "
                                f"Reason: {reason}. "
                                "Choose a different approach."
                            ),
                        }
                    )
                    continue

            result = await ctx.step.run(
                f"tool-{name}", execute_tool, name, tool_call["arguments"]
            )

            messages.append({"role": "tool", "content": result})

    return {"status": "max_iterations_reached"}


# !snippet:end

all_tools: list[dict[str, typing.Any]] = []


async def call_llm(
    messages: list[dict[str, typing.Any]],
    tools: list[dict[str, typing.Any]],
) -> dict[str, typing.Any]:
    raise NotImplementedError


async def execute_tool(name: str, arguments: dict[str, typing.Any]) -> str:
    raise NotImplementedError


async def send_slack_message(*, channel: str, text: str) -> None:
    raise NotImplementedError
