from .stubs import inngest_client

# !snippet:start
import inngest


@inngest_client.create_function(
    fn_id="my-function",
    trigger=[
        inngest.TriggerEvent(event="a"),
        inngest.TriggerEvent(event="b"),
    ],
)
async def my_function(ctx: inngest.Context) -> None:
    if ctx.event.name == "a":
        # Handle event A
        pass
    elif ctx.event.name == "b":
        # Handle event B
        pass
    else:
        # Handle the `inngest/scheduled.timer` (cron) or
        # `inngest/function.invoked` (step.invoke) event
        pass


# !snippet:end
