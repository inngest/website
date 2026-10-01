from .stubs import db, send_email

# !snippet:start
import inngest

inngest_client = inngest.Inngest(app_id="signup-flow")

# `send_email()` and `db` are your app's own helpers.


@inngest_client.create_function(
    fn_id="post-payment-flow",
    trigger=inngest.TriggerEvent(event="stripe/charge.created"),
)
async def fn(ctx: inngest.Context) -> dict[str, object]:
    # Each callable starts one step. ctx.group.parallel() runs them in
    # parallel and returns their results in order.
    email_id, updates = await ctx.group.parallel(
        (
            lambda: ctx.step.run(
                "confirmation-email", send_email, ctx.event.data["email"]
            ),
            lambda: ctx.step.run(
                "update-user", db.update_user_with_charge, ctx.event
            ),
        )
    )

    return {"emailID": email_id, "updates": updates}
# !snippet:end
