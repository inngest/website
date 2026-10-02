# !snippet:start
import json

import fastapi
import inngest

inngest_client = inngest.Inngest(app_id="my-app")
app = fastapi.FastAPI()


# NOTE - This is pseudo code for handling Slack interactions, please review
# their docs for implementation
@app.post("/api/slack/interactions")
async def slack_interactions(request: fastapi.Request) -> dict[str, str]:
    form = await request.form()
    payload = json.loads(str(form["payload"]))
    action = payload["actions"][0]
    value = json.loads(action["value"])

    # Send the event using the client
    await inngest_client.send(
        inngest.Event(
            name="agent/approval.response",
            data={
                "approvalId": value["approvalId"],
                "approved": value["approved"],
                "respondedBy": payload["user"]["id"],
                "reason": None if value["approved"] else "Rejected via Slack",
            },
        )
    )

    return {"text": "✅ Approved" if value["approved"] else "❌ Rejected"}


# !snippet:end
