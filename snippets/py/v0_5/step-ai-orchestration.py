import inngest
from inngest.experimental import ai

client = inngest.Inngest(app_id="my-app")


@client.create_function(
    fn_id="summarize-contents",
    trigger=inngest.TriggerEvent(event="app/ticket.created"),
)
async def summarize_contents(ctx: inngest.Context) -> object:
    # This calls your model's chat endpoint, adding AI observability,s
    # metrics, datasets, and monitoring to your calls.
    res = await ctx.step.ai.infer(
        "call-openai",
        adapter=ai.openai.Adapter(
            auth_key="sk-openai-000000",
            model="gpt-4o",
        ),
        # body is the model request
        body={
            "messages": [
                {
                    "role": "assistant",
                    "content": "Write instructions for improving short term memory",
                }
            ],
        },
    )

    # The response is a dict matching the provider's response
    return res["choices"]
