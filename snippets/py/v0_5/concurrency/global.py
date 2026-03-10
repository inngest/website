import inngest

inngest_client = inngest.Inngest(app_id="my-app")


# !snippet:start
@inngest_client.create_function(
    fn_id="func-a",
    trigger=inngest.TriggerEvent(event="ai/summary.requested"),
    concurrency=[
      inngest.Concurrency(
        scope="account",
        key='"openai"',
        limit=5
      )
    ]
)
async def func_a(ctx: inngest.Context):
    pass

@inngest_client.create_function(
    fn_id="func-b",
    trigger=inngest.TriggerEvent(event="ai/summary.requested"),
    concurrency=[
      inngest.Concurrency(
        scope="account",
        key='"openai"',
        limit=50
      )
    ]
)
async def func_b(ctx: inngest.Context):
    pass
