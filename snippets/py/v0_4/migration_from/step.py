import inngest

inngest_client = inngest.Inngest(app_id="my-app")

async def create_db_user() -> None:
    pass


# !snippet:start

@inngest_client.create_function(
    fn_id="provision-user",
    trigger=inngest.TriggerEvent(event="user.signup"),
)
async def fn(ctx: inngest.Context, step: inngest.Step) -> None:
    await step.run("create-user", create_db_user)
