import inngest

inngest_client = inngest.Inngest(app_id="my-app")

async def update_user(user_id: object) -> None:
    pass

async def send_email(user_id: object) -> None:
    pass


# !snippet:start
@inngest_client.create_function(
    fn_id="my-fn",
    trigger=inngest.TriggerEvent(event="my-event"),
)
async def fn( ctx: inngest.Context) -> None:
    user_id = ctx.event.data["user_id"]

    await ctx.group.parallel(
        (
            lambda: ctx.step.run("update-user", update_user, user_id),
            lambda: ctx.step.run("send-email", send_email, user_id),
        )
    )
