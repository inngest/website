from .stubs import inngest_client

# !snippet:start
import inngest


@inngest_client.create_function(
    fn_id="send-checkout-email",
    # This is the idempotency key
    idempotency="event.data.cartId",
    # Evaluates to: "s6CIMNqIaxt503I1gVEICfwp"
    # for the given event payload
    trigger=inngest.TriggerEvent(event="cart/checkout.completed"),
)
async def send_email(ctx: inngest.Context) -> None:
    ...


# !snippet:end
