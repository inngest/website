# !snippet:start
# Requires the inngest release after 0.5.19.
import inngest
import pydantic
from inngest.experimental import create_defer

from .client import inngest_client
from .email import send_email_message


class SendEmailInput(pydantic.BaseModel):
    to: str


@create_defer(inngest_client, fn_id="send-email")
async def send_email(ctx: inngest.Context) -> None:
    # Python has no defer schema option; validate the payload here.
    data = SendEmailInput.model_validate(ctx.event.data)
    await ctx.step.run("send", send_email_message, data.to)


@inngest_client.create_function(
    fn_id="order-placed",
    trigger=inngest.TriggerEvent(event="order/placed"),
)
async def order_placed(ctx: inngest.Context) -> None:
    ctx.defer(
        "send-confirmation",
        function=send_email,
        data={"to": ctx.event.data["email"]},
    )
# !snippet:end
