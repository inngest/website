import signal

from inngest.connect import connect

from .inngest_app import client, functions

# !snippet:start
# Pass a list of signals to `shutdown_signals` to configure which
# signals the SDK listens for (defaults to SIGTERM and SIGINT):
connection = connect(
    apps=[(client, functions)],
    # ex. Only listen for SIGTERM, or pass an empty list to listen to no signals
    shutdown_signals=[signal.SIGTERM],
)
# !snippet:end
