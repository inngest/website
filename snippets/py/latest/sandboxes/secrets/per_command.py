import os

from inngest.experimental.sandbox import DurableSandbox


async def publish(sb: DurableSandbox) -> None:
    # Python steps don't record their inputs, so the value never reaches
    # the trace.
    await sb.commands.run(
        "publish",
        ["pnpm", "publish"],
        environment={"NPM_TOKEN": os.environ["NPM_TOKEN"]},
    )
