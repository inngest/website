import inngest

from .client import inngest_client


async def handler(ctx: inngest.Context, original_run_id: str) -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    # Python always takes run_id, even inside the run you're scoring.
    await inngest_client.score(name="resolved", value=True, run_id=ctx.run_id)
    await inngest_client.score(
        name="resolved",
        value=True,
        run_id=original_run_id,
    )
    # !snippet:end
