import uuid

from inngest.experimental.sandbox import Sandbox

from .client import inngest_client


async def create_with_secrets() -> Sandbox:
    # !snippet:start
    sandbox = await inngest_client.sandboxes.create(
        name=f"agent-{uuid.uuid4()}",
        vcpu=1,
        memory_mb=1024,
        environment={
            "APP_ENV": "beta",
        },
        secrets=["OPENAI_API_KEY", "GITHUB_TOKEN"],
    )
    # !snippet:end
    return sandbox
