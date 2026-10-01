import typing

import inngest

from .stubs import llm


async def durable_llm_call(
    ctx: inngest.Context, request: dict[str, typing.Any]
) -> None:
    # !snippet:start
    # ✅ Durable — retries on failure, result is checkpointed
    async def think() -> dict[str, typing.Any]:
        response = await llm.messages.create(**request)
        return response.model_dump(mode="json")

    result = await ctx.step.run("think", think)

    # ❌ Not durable — if this fails, you lose all prior work
    result = await llm.messages.create(**request)
    # !snippet:end
    del result
