import inngest
from inngest.experimental import step

inngest_client = inngest.Inngest(app_id="my-app")


@step("prepare-greeting")
async def prepare_greeting(name: str, *, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}!"


@inngest_client.create_function(
    fn_id="greet-user",
    trigger=inngest.TriggerEvent(event="app/greet-user"),
)
async def greet_user(ctx: inngest.Context) -> str:
    name = ctx.event.data["name"]
    assert isinstance(name, str)
    return await prepare_greeting(name, greeting="Welcome")
