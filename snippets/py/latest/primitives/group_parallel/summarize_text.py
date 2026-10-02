from .stubs import (
    split_text_into_chunks,
    summarize_chunk,
    summarize_summaries,
)

# !snippet:start
import typing

import inngest

inngest_client = inngest.Inngest(app_id="signup-flow")

# `split_text_into_chunks()`, `summarize_chunk()`, and
# `summarize_summaries()` are your app's own helpers.


@inngest_client.create_function(
    fn_id="summarize-text",
    trigger=inngest.TriggerEvent(event="app/text.summarize"),
)
async def fn(ctx: inngest.Context) -> None:
    chunks = split_text_into_chunks(ctx.event.data["text"])

    def summarize(
        index: int, chunk: str
    ) -> typing.Callable[[], typing.Awaitable[str]]:
        return lambda: ctx.step.run(
            f"summarize-chunk-{index}", summarize_chunk, chunk
        )

    summaries = await ctx.group.parallel(
        tuple(summarize(index, chunk) for index, chunk in enumerate(chunks))
    )

    await ctx.step.run(
        "summarize-summaries", summarize_summaries, list(summaries)
    )
# !snippet:end
