# !snippet:start
import datetime
import uuid

from .client import inngest_client


async def pause_and_resume() -> None:
    # Leaving the `async with` block destroys the Sandbox.
    async with inngest_client.sandboxes.create(
        name=f"paused-work-{uuid.uuid4()}",
        vcpu=1,
        memory_mb=1024,
    ) as sandbox:
        await sandbox.commands.run(
            "printf 'work in progress\\n' > /tmp/progress.txt"
        )

        paused = await sandbox.pause(timeout=datetime.timedelta(minutes=5))
        print(paused.status)

        running = await paused.resume(timeout=datetime.timedelta(minutes=5))

        print(running.id == paused.id)
        print(running.status)

        result = await running.commands.run("cat /tmp/progress.txt")
        print(result.stdout)


# !snippet:end
