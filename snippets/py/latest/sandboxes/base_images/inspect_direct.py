import datetime

from inngest.experimental.sandbox import Sandbox


async def inspect_image(sandbox: Sandbox) -> None:
    # !snippet:start
    result = await sandbox.commands.run(
        "node --version && python3 --version && ruby --version && git --version",
        timeout=datetime.timedelta(seconds=30),
    )

    print(result.stdout)
    print(result.stderr)
    print(result.exit_code)
    # !snippet:end
