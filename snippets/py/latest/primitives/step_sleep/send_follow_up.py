from .stubs import send_follow_up_email

# !snippet:start
import datetime

import inngest

inngest_client = inngest.Inngest(app_id="my-app")


@inngest_client.create_function(
    fn_id="send-follow-up",
    trigger=inngest.TriggerEvent(event="app/user.signed-up"),
)
async def send_follow_up(ctx: inngest.Context) -> None:
    await ctx.step.sleep(
        "wait-before-follow-up", datetime.timedelta(minutes=30)
    )

    await ctx.step.run(
        "send-follow-up", send_follow_up_email, ctx.event.data["email"]
    )
# !snippet:end
