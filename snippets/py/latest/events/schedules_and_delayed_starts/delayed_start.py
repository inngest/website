import time

import inngest

from .stubs import inngest_client


async def send_reminder() -> None:
    # !snippet:start
    await inngest_client.send(
        inngest.Event(
            name="notifications/reminder.due",
            data={"reminderId": "rem_123"},
            ts=int((time.time() + 5 * 60) * 1000),
        )
    )
    # !snippet:end
