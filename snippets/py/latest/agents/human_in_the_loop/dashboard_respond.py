# !snippet:start
import fastapi
import inngest
import pydantic

inngest_client = inngest.Inngest(app_id="my-app")
app = fastapi.FastAPI()


class ApprovalBody(pydantic.BaseModel):
    approved: bool
    reason: str | None = None


@app.post("/api/approvals/{approval_id}/respond")
async def respond(
    approval_id: str, body: ApprovalBody, request: fastapi.Request
) -> dict[str, str]:
    await inngest_client.send(
        inngest.Event(
            name="agent/approval.response",
            data={
                "approvalId": approval_id,
                "approved": body.approved,
                "respondedBy": current_user_id(request),
                "reason": body.reason,
            },
        )
    )

    return {"status": "response_recorded"}


# !snippet:end


def current_user_id(request: fastapi.Request) -> str:
    raise NotImplementedError
