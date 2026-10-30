import datetime
import uuid

from inngest.experimental.sandbox import Sandbox


async def snapshot_and_clone(sandbox: Sandbox) -> None:
    # !snippet:start
    await sandbox.commands.run(
        "mkdir -p /work && printf 'prepared\\n' > /work/config.txt"
    )

    snapshot = await sandbox.snapshot(timeout=datetime.timedelta(minutes=5))

    try:
        # Leaving the `async with` block destroys the clone.
        async with snapshot.clone(
            name=f"prepared-{uuid.uuid4()}",
            running_timeout=datetime.timedelta(minutes=2),
        ) as clone:
            result = await clone.commands.run("cat /work/config.txt")
            print(result.stdout)
    finally:
        await snapshot.delete()
    # !snippet:end
