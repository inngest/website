# !snippet:start
import fastapi
import inngest.fast_api

from .inngest_app import functions, inngest_client

app = fastapi.FastAPI()

# Serve the functions at /api/inngest. For Flask, use inngest.flask.serve.
inngest.fast_api.serve(app, inngest_client, functions)
# !snippet:end
