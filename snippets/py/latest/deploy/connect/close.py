from inngest.connect import connect

from .inngest_app import client, functions

connection = connect(apps=[(client, functions)])


async def close() -> None:
    # !snippet:start
    # wait=True waits until the connection has finished closing
    await connection.close(wait=True)
    # Connection is now closed
    # !snippet:end
