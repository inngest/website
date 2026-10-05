# !snippet:start
import typing

import anthropic
import inngest

inngest_client = inngest.Inngest(app_id="my-app")
llm = anthropic.AsyncAnthropic()


@inngest_client.create_function(
    fn_id="agent-loop",
    trigger=inngest.TriggerEvent(event="agent/message.received"),
)
async def agent(ctx: inngest.Context) -> dict[str, typing.Any]:
    messages: list[dict[str, typing.Any]] = [
        # Prepare your initial messages list w/ system, user prompts
        {"role": "user", "content": ctx.event.data["message"]},
    ]

    max_iterations = 10
    iterations = 0
    done = False

    while not done and iterations < max_iterations:
        iterations += 1

        # 1. Think — ask the LLM what to do next
        async def think() -> dict[str, typing.Any]:
            response = await llm.messages.create(
                model="claude-opus-4-6",
                max_tokens=4096,
                # Use your own expertly crafted prompt:
                system="You are a helpful assistant with access to tools.",
                messages=messages,
                tools=tools,  # your tool definitions
            )
            # Step results must be JSON-serializable.
            return response.model_dump(mode="json")

        llm_result = await ctx.step.run("think", think)

        # 2. Check if the LLM wants to use tools
        tool_calls = [
            block
            for block in llm_result["content"]
            if block["type"] == "tool_use"
        ]

        if not tool_calls:
            # No tools — we're done
            text = next(
                (
                    b["text"]
                    for b in llm_result["content"]
                    if b["type"] == "text"
                ),
                "",
            )
            done = True
            return {"response": text, "iterations": iterations}

        # 3. Act — execute each tool
        messages.append(
            {"role": "assistant", "content": llm_result["content"]}
        )
        tool_results: list[dict[str, typing.Any]] = []

        for tool_call in tool_calls:
            result = await ctx.step.run(
                f"tool-{tool_call['name']}",
                execute_tool,
                tool_call["name"],
                tool_call["input"],
            )
            tool_results.append(
                {
                    "type": "tool_result",
                    "tool_use_id": tool_call["id"],
                    "content": result,
                }
            )

        # 4. Observe — feed results back and loop
        messages.append({"role": "user", "content": tool_results})

    return {"response": "Reached iteration limit", "iterations": iterations}


# !snippet:end

tools: list[dict[str, typing.Any]] = []


async def execute_tool(name: str, tool_input: dict[str, typing.Any]) -> str:
    raise NotImplementedError
