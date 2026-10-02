# !snippet:start
import datetime
import json
import typing

import inngest

inngest_client = inngest.Inngest(app_id="my-app")


@inngest_client.create_function(
    fn_id="email-approval-workflow",
    trigger=inngest.TriggerEvent(event="agent/email.draft-requested"),
)
async def email_approval_workflow(ctx: inngest.Context) -> dict[str, str]:
    recipient = str(ctx.event.data["recipient"])
    context = str(ctx.event.data["context"])
    approval_id = ctx.event.data["approvalId"]

    # Step 1: Agent drafts the email
    async def draft_email() -> dict[str, str]:
        return await generate_email(
            recipient=recipient, context=context, tone="professional"
        )

    draft = await ctx.step.run("draft-email", draft_email)

    # Step 2: Notify the human via Slack
    async def request_approval() -> None:
        await send_slack_message(
            channel="#agent-approvals",
            blocks=[
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": (
                            "*Agent wants to send an email*\n\n"
                            f"*To:* {recipient}\n"
                            f"*Subject:* {draft['subject']}\n\n"
                            f"{draft['body']}"
                        ),
                    },
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "✅ Approve",
                            },
                            "action_id": "approve_email",
                            "value": json.dumps(
                                {"approvalId": approval_id, "approved": True}
                            ),
                            "style": "primary",
                        },
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "❌ Reject",
                            },
                            "action_id": "reject_email",
                            "value": json.dumps(
                                {"approvalId": approval_id, "approved": False}
                            ),
                            "style": "danger",
                        },
                    ],
                },
            ],
        )

    await ctx.step.run("request-approval", request_approval)

    # Step 3: Wait for human response — no compute cost while waiting
    approval = await ctx.step.wait_for_event(
        "wait-for-approval",
        event="agent/approval.response",
        if_exp="async.data.approvalId == event.data.approvalId",
        timeout=datetime.timedelta(hours=24),
    )

    # Step 4: Handle the response
    # No event means it timed out
    if approval is None:

        async def notify_timeout() -> None:
            await send_slack_message(
                channel="#agent-approvals",
                text=(
                    "⏰ Email approval timed out. Draft discarded.\n"
                    f"*To:* {recipient}\n*Subject:* {draft['subject']}"
                ),
            )

        await ctx.step.run("notify-timeout", notify_timeout)
        return {"status": "timed_out", "action": "email_not_sent"}

    # The event payload can be used with whatever parameters that you send
    if approval.data.get("approved"):

        async def send() -> None:
            await send_email(
                to=recipient, subject=draft["subject"], body=draft["body"]
            )

        await ctx.step.run("send-email", send)
        return {"status": "approved", "action": "email_sent"}

    return {
        "status": "rejected",
        "reason": str(approval.data.get("reason") or "No reason provided"),
        "action": "email_not_sent",
    }


# !snippet:end


async def generate_email(
    *, recipient: str, context: str, tone: str
) -> dict[str, str]:
    raise NotImplementedError


async def send_slack_message(
    *,
    channel: str,
    text: str | None = None,
    blocks: list[dict[str, typing.Any]] | None = None,
) -> None:
    raise NotImplementedError


async def send_email(*, to: str, subject: str, body: str) -> None:
    raise NotImplementedError
