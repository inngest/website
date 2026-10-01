import os

import inngest

# !snippet:start
# You can set the app version to any environment variable, you might use
# a build number ('v2025.02.12.01'), git commit sha ('f5a40ff'), or
# a custom value ('my-app-v1').
client = inngest.Inngest(
    app_id="my-app",
    # Use any environment variable you choose
    app_version=os.getenv("MY_APP_VERSION"),
)
# !snippet:end
