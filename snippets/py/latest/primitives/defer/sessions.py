import inngest

from .stubs import send_email


async def fn(ctx: inngest.Context) -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    ctx.defer(
        "send-confirmation",
        function=send_email,
        data={"to": ctx.event.data["email"], "body": "Thanks for your order!"},
        meta={
            "sessions": {
                "conversation_id": str(ctx.event.data["conversationId"]),
            },
        },
    )
    # !snippet:end
