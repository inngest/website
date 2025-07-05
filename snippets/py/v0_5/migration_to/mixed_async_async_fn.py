import inngest

inngest_client = inngest.Inngest(app_id="my-app")


# !snippet:start
def on_failure(ctx: inngest.ContextSync) -> None:
    pass


@inngest_client.create_function(
    fn_id="foo",
    trigger=inngest.TriggerEvent(event="foo"),
    on_failure=on_failure,
)
async def fn(ctx: inngest.Context) -> None:
    pass
