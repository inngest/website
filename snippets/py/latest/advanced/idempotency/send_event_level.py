import inngest

from .stubs import inngest_client


async def send_checkout_completed(checkout_id: str) -> None:
    # !snippet:start
    await inngest_client.send(
        inngest.Event(
            id=f"checkout-completed-{checkout_id}",
            name="cart/checkout.completed",
            data={"checkoutId": checkout_id},
        )
    )
    # !snippet:end
