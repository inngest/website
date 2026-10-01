import inngest

from .client import inngest_client


async def send_feedback() -> None:
    # !snippet:start
    await inngest_client.send(
        inngest.Event(
            name="support/feedback.received",
            data={"ticketId": "tk_123", "helpful": True},
        )
    )
    # !snippet:end
