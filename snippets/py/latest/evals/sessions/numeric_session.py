import inngest

from .client import inngest_client


async def send() -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    await inngest_client.send(
        inngest.Event(
            name="app/agent.step.completed",
            data={
                "stepId": "step_1",
            },
            meta={
                "sessions": {
                    "conversation_id": "conv_1234",
                    "thread_id": 29563,
                },
            },
        )
    )
    # !snippet:end
