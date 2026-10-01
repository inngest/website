# !snippet:start
import inngest
from inngest.experimental import realtime

from .client import inngest_client
from .model import stream_completion

MODEL = "gpt-5"


@inngest_client.create_function(
    fn_id="generate-response",
    trigger=inngest.TriggerEvent(event="app/prompt.submitted"),
)
async def generate_response(ctx: inngest.Context) -> None:
    # One channel per conversation thread.
    channel = f"ai-thread:{ctx.event.data['threadId']}"
    prompt = str(ctx.event.data["prompt"])

    # Python has no durable publish step, so wrap one-time publishes in
    # ctx.step.run(). A retry won't send this status again.
    async def publish_start() -> None:
        await realtime.publish(
            client=inngest_client,
            channel=channel,
            topic="status",
            data={"message": "Generating response...", "progress": 0},
        )

    await ctx.step.run("start", publish_start)

    async def stream_model() -> dict[str, object]:
        text = ""
        output_tokens = 0

        # stream_completion() wraps your model provider's streaming API, such as
        # the OpenAI Responses API with stream=True, and yields text deltas
        # followed by a completion chunk with usage.
        async for chunk in stream_completion(model=MODEL, prompt=prompt):
            if chunk.type == "delta":
                text += chunk.delta

                # Immediate on purpose: one publish per token, and a replay on
                # retry is cheaper than making each token a durable step.
                await realtime.publish(
                    client=inngest_client,
                    channel=channel,
                    topic="tokens",
                    data={"token": chunk.delta},
                )

            if chunk.type == "completed":
                output_tokens = chunk.output_tokens

        return {"text": text, "output_tokens": output_tokens}

    generated = await ctx.step.run("stream-model", stream_model)

    # Memoized as a step, so retrying past this point will not publish the
    # result a second time.
    async def publish_result() -> None:
        await realtime.publish(
            client=inngest_client,
            channel=channel,
            topic="result",
            data={
                "output": generated["text"],
                "model": MODEL,
                "outputTokens": generated["output_tokens"],
            },
        )

    await ctx.step.run("send-result", publish_result)
# !snippet:end
