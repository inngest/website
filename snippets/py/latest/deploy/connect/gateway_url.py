from inngest.connect import connect

from .inngest_app import client, functions

# !snippet:start
connection = connect(
    apps=[(client, functions)],
    rewrite_gateway_endpoint=lambda endpoint: (
        "ws://my-cluster-host:8289/v0/connect"
    ),
)
# !snippet:end
