import inngest

from .stubs import inngest_client


async def send_cart_checkout_completed() -> None:
    # !snippet:start
    cart_id = "CGo5Q5ekAxilN92d27asEoDO"
    await inngest_client.send(
        inngest.Event(
            id=f"checkout-completed-{cart_id}",  # <-- The idempotency key
            name="cart/checkout.completed",
            data={
                "email": "taylor@example.com",
                "cartId": cart_id,
            },
        )
    )
    # !snippet:end
