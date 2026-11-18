from inngest.experimental.sandbox import Sandbox

from .client import inngest_client


async def name_snapshot(sandbox: Sandbox) -> None:
    # !snippet:start
    snapshot = await sandbox.snapshot(name="deps-installed")

    found = await inngest_client.sandboxes.snapshots.list(
        name="deps-installed"
    )
    # !snippet:end
    print(snapshot.id, found.items)
