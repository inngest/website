from .stubs import inngest_client

# !snippet:start
import inngest


@inngest_client.create_function(
    fn_id="run-generation",
    # Given the event payload sends a hash of the prompt,
    # this will only run once per unique prompt per user
    # every 24 hours:
    idempotency='event.data.promptHash + "-" + event.data.userId',
    trigger=inngest.TriggerEvent(event="ai/generation.requested"),
)
async def run_generation(ctx: inngest.Context) -> None:
    # Track the request
    ...


# !snippet:end
