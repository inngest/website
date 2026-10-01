# !snippet:start
from inngest.experimental import realtime

from .client import inngest_client


async def report_progress() -> None:
    # Channels and topics are plain strings in Python.
    await realtime.publish(
        client=inngest_client,
        channel="document:abc123",
        topic="status",
        data={"message": "Analyzing", "progress": 50},
    )
# !snippet:end
