from inngest.connect import connect

from .inngest_app import client, functions

# !snippet:start
connection = connect(
    apps=[(client, functions)],
    max_worker_concurrency=10,
)
# !snippet:end
