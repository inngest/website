# !snippet:start
import uuid

import inngest

from .client import inngest_client


async def start_workflow() -> str:
    thread_id = str(uuid.uuid4())

    await inngest_client.send(
        inngest.Event(
            name="app/prompt.submitted",
            data={
                "threadId": thread_id,
                "prompt": "Summarize the key points of this document...",
            },
        )
    )
    return thread_id
# !snippet:end
