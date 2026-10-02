import inngest


async def validate(ctx: inngest.Context) -> None:
    # !snippet:start
    if not ctx.event.data.get("orderId"):
        raise inngest.NonRetriableError("orderId is required")
    # !snippet:end
