# type: ignore

import inngest

inngest_client = inngest.Inngest(app_id="my-app")


# !snippet:start
@inngest_client.create_function(
    fn_id="foo",
    trigger=inngest.TriggerEvent(event="foo"),
)
async def fn(ctx: inngest.Context) -> None:
    # Type error because `lambda: "hello"` is non-async.
    msg = await ctx.step.run("step", lambda: "hello")

    # Runtime value is "hello", as expected.
    print(msg)
