from .stubs import inngest_client

# !snippet:start
import inngest


@inngest_client.create_function(
    fn_id="watch-function-failures",
    trigger=inngest.TriggerEvent(event="inngest/function.failed"),
)
async def watch_failures(ctx: inngest.Context) -> None:
    ctx.logger.error(
        "function failed %s %s",
        ctx.event.data["function_id"],
        ctx.event.data["run_id"],
    )


# !snippet:end
