import inngest

inngest_client = inngest.Inngest(app_id="my-app")


# !snippet:start
@inngest_client.create_function(
    fn_id="generate-ai-summary",
    concurrency=[
        inngest.Concurrency(
            # Use an account-level concurrency limit for this function, using the
            # "openai" key as a virtual queue.  Any other function which
            # runs using the same "openai" key counts towards this limit.
            scope="account",
            key='"openai"',
            limit=10,
        ),
        inngest.Concurrency(
            # Create another virtual concurrency queue for this function only.  This
            # limits all accounts to a single execution for this function, based off
            # of the `event.data.account_id` field.
            # NOTE - "fn" is the default scope, so we could omit this field.
            scope="fn",
            key="event.data.account_id",
            limit=1,
        ),
    ],
    trigger=inngest.TriggerEvent(event="ai/summary.requested"),
)
async def generate_ai_summary(ctx: inngest.Context):
    # Your function handler here
    pass
