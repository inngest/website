from .stubs import db, send_email_sync

# !snippet:start
import inngest

inngest_client = inngest.Inngest(app_id="signup-flow")


@inngest_client.create_function(
    fn_id="post-payment-flow",
    trigger=inngest.TriggerEvent(event="stripe/charge.created"),
)
def fn(ctx: inngest.ContextSync) -> dict[str, object]:
    email_id, updates = ctx.group.parallel(
        (
            lambda: ctx.step.run(
                "confirmation-email", send_email_sync, ctx.event.data["email"]
            ),
            lambda: ctx.step.run(
                "update-user", db.update_user_with_charge_sync, ctx.event
            ),
        )
    )

    return {"emailID": email_id, "updates": updates}
# !snippet:end
