# !snippet:start
# Requires inngest 0.5.20 or newer.
import asyncio
import datetime
import uuid

import inngest
from inngest.experimental.sandbox import image

inngest_client = inngest.Inngest(
    app_id="custom-image-demo", is_production=True
)


async def main() -> None:
    # Leaving the `async with` block destroys the Sandbox.
    async with inngest_client.sandboxes.create(
        name=f"python-{uuid.uuid4()}",
        vcpu=2,
        memory_mb=2048,
        image=image.custom("my-python:v1"),
        running_timeout=datetime.timedelta(minutes=3),
    ) as sandbox:
        result = await sandbox.commands.run(
            [
                "python3",
                "-c",
                "import os, flask, requests; print(os.environ['APP_ENV'])",
            ]
        )
        print(result.stdout)  # custom-image
        print(sandbox.image_ref, sandbox.image_digest)


asyncio.run(main())
# !snippet:end
