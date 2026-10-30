import datetime

import inngest
from inngest.experimental.sandbox import DurableSandbox


async def clone_builder(ctx: inngest.Context, builder: DurableSandbox) -> str:
    # !snippet:start
    snapshot = await builder.snapshot(
        "snapshot-builder",
        timeout=datetime.timedelta(minutes=5),
    )

    clone = await snapshot.clone(
        "clone-worker",
        name=f"worker-{ctx.event.data['jobId']}",
        running_timeout=datetime.timedelta(minutes=2),
    )

    result = await clone.commands.run(
        "run-check",
        "node -p \"require('/tmp/project/node_modules/lodash').VERSION\"",
    )

    await clone.destroy("destroy-clone")
    await snapshot.delete("delete-snapshot")

    return result.stdout
    # !snippet:end
