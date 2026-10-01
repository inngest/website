import fastapi
import inngest.fast_api

from .answer import answer_ticket
from .client import inngest_client
from .scorer import feedback_scorer

app = fastapi.FastAPI()

# !snippet:start
inngest.fast_api.serve(app, inngest_client, [answer_ticket, feedback_scorer])
# !snippet:end
