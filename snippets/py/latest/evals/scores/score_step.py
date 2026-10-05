import inngest

from .stubs import ModelResult, call_model

inngest_client = inngest.Inngest(app_id="support")


async def handler(ctx: inngest.Context, prompt: str) -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    async def run_model() -> dict[str, object]:
        result: ModelResult = await call_model(prompt)
        # Pass the run ID and this step's ID to score the step.
        await inngest_client.score(
            name="model-confidence",
            value=result.confidence,
            run_id=ctx.run_id,
            step_id="call-model",
        )
        return {"text": result.text, "confidence": result.confidence}

    await ctx.step.run("call-model", run_model)
    # !snippet:end
