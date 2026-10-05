import typing

import inngest


class _MemoryStore:
    async def load(self, conversation_id: str) -> dict[str, typing.Any]:
        raise NotImplementedError

    async def save(
        self, conversation_id: str, value: dict[str, typing.Any]
    ) -> None:
        raise NotImplementedError


memory = _MemoryStore()


async def memory_example(ctx: inngest.Context) -> None:
    answer = ""
    summary = ""
    # !snippet:start
    conversation_id = str(ctx.event.data["conversationId"])

    history = await ctx.step.run("load-memory", memory.load, conversation_id)

    # ...run the loop with history + the new message...

    async def save_memory() -> None:
        await memory.save(
            conversation_id, {"answer": answer, "summary": summary}
        )

    await ctx.step.run("save-memory", save_memory)
    # !snippet:end
    del history
