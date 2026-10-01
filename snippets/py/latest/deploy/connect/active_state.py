import asyncio

from inngest.connect import ConnectionState, connect

from .inngest_app import client, functions


async def main() -> None:
    # !snippet:start
    connection = connect(apps=[(client, functions)])

    # start() runs until the connection closes, so run it in a task
    worker = asyncio.create_task(connection.start())

    # Wait until the connection is ACTIVE
    await connection.wait_for_state(ConnectionState.ACTIVE)
    print(f"The worker connection is: {connection.get_state().value}")
    # The worker connection is: ACTIVE
    # !snippet:end
    await worker
