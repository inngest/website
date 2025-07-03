import inngest

inngest_client = inngest.Inngest(app_id="my-app")

async def create_db_user() -> None:
    pass

@inngest_client.create_function(
    fn_id="provision-user",
    trigger=inngest.TriggerEvent(event="user.signup"),
)
async def fn(ctx: inngest.Context) -> None:
    await ctx.step.run("create-user", create_db_user)
