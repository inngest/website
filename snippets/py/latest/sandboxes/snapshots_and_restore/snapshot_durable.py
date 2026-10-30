import datetime

import inngest
from inngest.experimental.sandbox import DurableSandbox


async def snapshot_and_clone(
    ctx: inngest.Context, sandbox: DurableSandbox
) -> str:
    # !snippet:start
    snapshot = await sandbox.snapshot(
        "snapshot-prepared-sandbox",
        timeout=datetime.timedelta(minutes=5),
    )

    clone = await snapshot.clone(
        "clone-prepared-sandbox",
        name=f"prepared-{ctx.event.data['jobId']}",
        running_timeout=datetime.timedelta(minutes=2),
    )

    result = await clone.commands.run(
        "read-prepared-file",
        "cat /work/config.txt",
    )

    await clone.destroy("destroy-clone")
    await snapshot.delete("delete-snapshot")

    return result.stdout
    # !snippet:end
