import datetime
import uuid

from .client import inngest_client


async def build_and_clone() -> None:
    # !snippet:start
    # Leaving each `async with` block destroys that Sandbox.
    async with inngest_client.sandboxes.create(
        name=f"builder-{uuid.uuid4()}",
        vcpu=2,
        memory_mb=2048,
    ) as builder:
        await builder.commands.run(
            "mkdir -p /tmp/project && cd /tmp/project && npm init -y && npm install lodash",
            timeout=datetime.timedelta(minutes=5),
        )

        snapshot = await builder.snapshot(
            timeout=datetime.timedelta(minutes=5)
        )

        try:
            async with snapshot.clone(
                name=f"worker-{uuid.uuid4()}",
                running_timeout=datetime.timedelta(minutes=2),
            ) as clone:
                result = await clone.commands.run(
                    "node -p \"require('/tmp/project/node_modules/lodash').VERSION\"",
                )

                print(clone.id, result.stdout)
        finally:
            await snapshot.delete()
    # !snippet:end
