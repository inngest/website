# !snippet:start
import typing

import anthropic
import inngest

inngest_client = inngest.Inngest(app_id="my-app")
llm = anthropic.AsyncAnthropic()


@inngest_client.create_function(
    fn_id="support-agent",
    trigger=inngest.TriggerEvent(event="agent/message.received"),
)
async def support_agent(ctx: inngest.Context) -> dict[str, str]:
    messages: list[dict[str, typing.Any]] = [
        {"role": "user", "content": ctx.event.data["message"]},
    ]

    for _ in range(10):
        # Think: ask the model what to do next.
        async def think() -> dict[str, typing.Any]:
            response = await llm.messages.create(
                model="claude-opus-4-6",
                max_tokens=4096,
                system="You are a support agent with access to tools.",
                messages=messages,
                tools=tools,
            )
            # Step results must be JSON-serializable.
            return response.model_dump(mode="json")

        response = await ctx.step.run("think", think)

        tool_calls = [
            block
            for block in response["content"]
            if block["type"] == "tool_use"
        ]

        # No tool calls: the model has answered.
        if not tool_calls:
            text = next(
                (
                    b["text"]
                    for b in response["content"]
                    if b["type"] == "text"
                ),
                "",
            )
            return {"answer": text}

        # Act: run each tool as its own step.
        messages.append({"role": "assistant", "content": response["content"]})
        results: list[dict[str, typing.Any]] = []
        for call in tool_calls:
            output = await ctx.step.run(
                f"tool-{call['name']}",
                execute_tool,
                call["name"],
                call["input"],
            )
            results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": call["id"],
                    "content": output,
                }
            )

        # Observe: feed the results back and loop.
        messages.append({"role": "user", "content": results})

    return {"answer": "Reached the iteration limit."}


# !snippet:end

# Stand-ins for your tool definitions and tool code.
tools: list[dict[str, typing.Any]] = []


async def execute_tool(name: str, tool_input: dict[str, typing.Any]) -> str:
    raise NotImplementedError
