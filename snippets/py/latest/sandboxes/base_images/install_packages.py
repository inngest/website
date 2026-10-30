import datetime

from inngest.experimental.sandbox import Sandbox


async def install_packages(sandbox: Sandbox) -> None:
    # !snippet:start
    await sandbox.commands.run(
        "mkdir -p /tmp/project && cd /tmp/project && npm init -y && npm install lodash",
        timeout=datetime.timedelta(minutes=5),
    )
    # !snippet:end
