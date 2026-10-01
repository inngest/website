import inngest

inngest_client = inngest.Inngest(app_id="my-app")


@inngest_client.create_function(
    fn_id="hello-world",
    trigger=inngest.TriggerEvent(event="test/hello.world"),
)
async def hello_world(ctx: inngest.Context) -> str:
    return "Hello World!"
