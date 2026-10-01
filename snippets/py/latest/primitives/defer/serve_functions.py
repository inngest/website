from .stubs import my_functions

# !snippet:start
# Requires the inngest release after 0.5.19.
import fastapi
import inngest.fast_api

from .client import inngest_client
from .define_deferred import send_email

app = fastapi.FastAPI()

# my_functions: the other Inngest functions your app already serves
inngest.fast_api.serve(app, inngest_client, [*my_functions, send_email])
# !snippet:end
