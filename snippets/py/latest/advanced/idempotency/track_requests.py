from .stubs import inngest_client

# !snippet:start
import inngest


@inngest_client.create_function(
    fn_id="track-requests",
    trigger=inngest.TriggerEvent(event="ai/generation.requested"),
)
async def track_requests(ctx: inngest.Context) -> None:
    # Track the request
    ...


# !snippet:end
