import inngest

from .client import inngest_client


@inngest_client.create_function(
    fn_id="summarize-conversation",
    trigger=inngest.TriggerEvent(event="app/conversation.summarize"),
)
async def summarize_conversation(ctx: inngest.Context) -> None:
    return None
