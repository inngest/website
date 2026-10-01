import inngest

from .stubs import payments


async def idempotency_key_example(
    ctx: inngest.Context, amount: int, order_id: str
) -> None:
    # !snippet:start
    async def charge_customer() -> dict[str, str]:
        return await payments.charge(
            amount=amount,
            idempotency_key=f"order-{order_id}-charge",
        )

    await ctx.step.run("charge-customer", charge_customer)
    # !snippet:end
