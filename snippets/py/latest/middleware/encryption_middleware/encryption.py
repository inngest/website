# !snippet:start
import os

import inngest
from inngest_encryption import EncryptionMiddleware

encryption_key = os.environ.get("MY_ENCRYPTION_KEY")
if not encryption_key:
    raise RuntimeError("MY_ENCRYPTION_KEY is required")

inngest_client = inngest.Inngest(
    app_id="my-app",
    middleware=[EncryptionMiddleware.factory(encryption_key)],
)
# !snippet:end
