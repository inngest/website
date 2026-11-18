import inngest
from inngest.experimental.sandbox import DurableSandbox


async def create_with_secrets(ctx: inngest.Context) -> DurableSandbox:
    # !snippet:start
    sandbox = await ctx.step.sandbox.create(
        "create-sandbox",
        name=f"agent-{ctx.event.data['jobId']}",
        vcpu=1,
        memory_mb=1024,
        secrets=["OPENAI_API_KEY"],
    )
    # !snippet:end
    return sandbox
