from .stubs import inngest_client, stripe_secret, verify_sig

# !snippet:start
import json

import inngest


@inngest_client.create_function(
    fn_id="stripe/charge.updated",
    trigger=inngest.TriggerEvent(event="stripe/charge.updated"),
)
async def stripe_charge_updated(ctx: inngest.Context) -> None:
    raw = str(ctx.event.data["raw"])
    sig = str(ctx.event.data["sig"])

    # Replace verify_sig with the provider's verification method.
    if not verify_sig(raw, sig, stripe_secret):
        raise inngest.NonRetriableError("failed signature verification")

    # Now it's safe to use the event data.
    data = json.loads(raw)
    _ = data


# !snippet:end
