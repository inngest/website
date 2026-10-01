# !snippet:start
import inngest

inngest_client = inngest.Inngest(app_id="billing-app")


async def send_invoice_paid() -> list[str]:
    ids = await inngest_client.send(
        inngest.Event(
            name="billing/invoice.paid",
            data={"invoiceId": "inv_123", "customerId": "cus_456"},
        )
    )
    return ids


# !snippet:end
