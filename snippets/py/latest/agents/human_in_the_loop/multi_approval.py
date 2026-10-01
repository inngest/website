# !snippet:start
import datetime
import typing

import inngest

inngest_client = inngest.Inngest(app_id="my-app")


@inngest_client.create_function(
    fn_id="multi-approval-publish",
    trigger=inngest.TriggerEvent(event="content/publish.requested"),
)
async def multi_approval_workflow(
    ctx: inngest.Context,
) -> dict[str, typing.Any]:
    content_id = str(ctx.event.data["contentId"])

    content = await ctx.step.run(
        "generate-content", generate_content, content_id
    )

    # --- Gate 1: Editorial approval ---
    async def request_editorial_review() -> None:
        await send_slack_message(
            channel="#editorial",
            text=f"📝 Review needed: {content['title']}\n\n{content['preview']}",
        )

    await ctx.step.run("request-editorial-review", request_editorial_review)

    editorial_approval = await ctx.step.wait_for_event(
        "wait-editorial",
        event="content/review.completed",
        if_exp="async.data.contentId == event.data.contentId",
        timeout=datetime.timedelta(hours=48),
    )

    if editorial_approval is None or not editorial_approval.data.get(
        "approved"
    ):
        return {"status": "rejected_by_editorial"}

    # --- Gate 2: Legal approval ---
    async def request_legal_review() -> None:
        await send_slack_message(
            channel="#legal-review",
            text=(
                f"⚖️ Legal review needed: {content['title']}\n\n"
                "Editorial approved. Awaiting legal sign-off."
            ),
        )

    await ctx.step.run("request-legal-review", request_legal_review)

    legal_approval = await ctx.step.wait_for_event(
        "wait-legal",
        event="content/legal-review.completed",
        if_exp="async.data.contentId == event.data.contentId",
        timeout=datetime.timedelta(hours=72),
    )

    if legal_approval is None or not legal_approval.data.get("approved"):
        return {"status": "rejected_by_legal"}

    # --- Both gates passed ---
    await ctx.step.run("publish", publish_content, content)

    return {"status": "published", "approvals": ["editorial", "legal"]}


# !snippet:end


async def generate_content(content_id: str) -> dict[str, str]:
    raise NotImplementedError


async def send_slack_message(*, channel: str, text: str) -> None:
    raise NotImplementedError


async def publish_content(content: dict[str, str]) -> None:
    raise NotImplementedError
