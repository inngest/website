from inngest.connect import connect

from .inngest_app import client, functions

connection = connect(apps=[(client, functions)])


async def wait_for_closed() -> None:
    # !snippet:start
    # closed() returns when the connection is "CLOSED"
    await connection.closed()
    # Connection is now closed
    # !snippet:end
