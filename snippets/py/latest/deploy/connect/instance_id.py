import os

from inngest.connect import connect

from .inngest_app import client, functions

# !snippet:start
# Set the instance ID to any environment variable that is unique to the worker
connection = connect(
    apps=[(client, functions)],
    instance_id=os.getenv("MY_CONTAINER_ID"),
)
# !snippet:end
