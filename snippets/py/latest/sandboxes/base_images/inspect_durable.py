import datetime

from inngest.experimental.sandbox import (
    DurableSandbox,
    SandboxCommandResult,
)


async def inspect_image(sandbox: DurableSandbox) -> SandboxCommandResult:
    # !snippet:start
    result = await sandbox.commands.run(
        "inspect-image",
        "node --version && python3 --version && ruby --version && git --version",
        timeout=datetime.timedelta(seconds=30),
    )
    # !snippet:end
    return result
