# !snippet:start
# Requires the inngest release after 0.5.19.
import inngest
import pydantic
from inngest.experimental import create_defer

from .client import inngest_client


class SendEmailInput(pydantic.BaseModel):
    to: str
    body: str


@create_defer(
    inngest_client,
    fn_id="send-email",
    concurrency=[inngest.Concurrency(limit=5)],
)
async def send_email(ctx: inngest.Context) -> None:
    data = SendEmailInput.model_validate(ctx.event.data)
    print(data.to, data.body)
# !snippet:end
