import inngest


async def notify_accounting(ctx: inngest.Context) -> None:
    event = ctx.event
    step = ctx.step
    # !snippet:start
    await step.send_event(
        "notify-accounting",
        inngest.Event(
            name="billing/invoice.paid",
            data={"invoiceId": event.data["invoiceId"]},
        ),
    )
    # !snippet:end
