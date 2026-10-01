# !snippet:start
import inngest
import pydantic

inngest_client = inngest.Inngest(app_id="billing-app")


# The Python SDK has no event type helper. A Pydantic model validates the
# event data at runtime when you build or read it.
class InvoicePaid(pydantic.BaseModel):
    invoiceId: str
    customerId: str


async def send_invoice_paid() -> None:
    await inngest_client.send(
        inngest.Event(
            name="billing/invoice.paid",
            data=InvoicePaid(
                invoiceId="inv_123",
                customerId="cus_456",
            ).model_dump(),
        )
    )


# In a function triggered by the event:
# invoice = InvoicePaid.model_validate(ctx.event.data)


# !snippet:end
