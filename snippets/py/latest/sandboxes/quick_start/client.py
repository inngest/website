# !snippet:start
# Requires inngest 0.5.20 or newer. Python needs no Sandbox middleware:
# ctx.step.sandbox is available in every function.
import inngest

inngest_client = inngest.Inngest(app_id="sandbox-beta-demo")
# !snippet:end
