import inngest

from .summarize import summarize_conversation


async def handler(ctx: inngest.Context) -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    await ctx.step.invoke(
        "summarize-conversation",
        function=summarize_conversation,
        data={"conversationId": ctx.event.data["conversationId"]},
        meta={
            "sessions": {
                "conversation_id": None,
                "user_id": "usr_xyz",
            },
        },
    )
    # !snippet:end
