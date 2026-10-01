import typing

import inngest

from .stubs import llm


async def token_usage(
    ctx: inngest.Context, request: dict[str, typing.Any]
) -> dict[str, typing.Any] | None:
    max_iterations = 10
    iterations = 0
    done = False
    # !snippet:start
    total_input_tokens = 0

    while not done and iterations < max_iterations:

        async def think() -> dict[str, typing.Any]:
            response = await llm.messages.create(**request)
            return response.model_dump(mode="json")

        llm_result = await ctx.step.run("think", think)

        total_input_tokens += llm_result["usage"]["input_tokens"]
        if total_input_tokens > 500_000:
            return {
                "response": "Token budget exceeded",
                "iterations": iterations,
            }

        # ... rest of loop
    # !snippet:end
    return None
