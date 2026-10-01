import inngest

from .client import inngest_client


async def send() -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    await inngest_client.send(
        inngest.Event(
            name="support/message.received",
            data={"ticketId": "ticket_42", "messageId": "msg_17"},
            meta={
                "sessions": {
                    "ticket_id": "ticket_42",
                },
            },
        )
    )
    # !snippet:end
