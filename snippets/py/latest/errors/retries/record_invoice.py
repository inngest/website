from .stubs import load_invoice, record_invoice_in_ledger

# !snippet:start
import inngest

inngest_client = inngest.Inngest(app_id="billing-app")


@inngest_client.create_function(
    fn_id="record-invoice",
    trigger=inngest.TriggerEvent(event="billing/invoice.created"),
    retries=4,
)
async def record_invoice(ctx: inngest.Context) -> None:
    invoice_id = ctx.event.data["invoiceId"]

    async def load() -> dict[str, object]:
        return await load_invoice(invoice_id)

    invoice = await ctx.step.run("load-invoice", load)

    async def record() -> None:
        await record_invoice_in_ledger(invoice, invoice_id)

    await ctx.step.run("record-invoice", record)


# !snippet:end
