import inngest

inngest_client = inngest.Inngest(app_id="imports")


# !snippet:start
@inngest_client.create_function(
    fn_id="func-a",
    concurrency=[
        inngest.Concurrency(scope="account", key='"openai"', limit=5),
    ],
    trigger=inngest.TriggerEvent(event="ai/summary.requested"),
)
async def func_a(ctx: inngest.Context) -> None:
    pass


@inngest_client.create_function(
    fn_id="func-b",
    concurrency=[
        inngest.Concurrency(scope="account", key='"openai"', limit=50),
    ],
    trigger=inngest.TriggerEvent(event="ai/summary.requested"),
)
async def func_b(ctx: inngest.Context) -> None:
    pass


# !snippet:end
