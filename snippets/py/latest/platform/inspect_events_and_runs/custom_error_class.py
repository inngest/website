import inngest

inngest_client = inngest.Inngest(app_id="my-app")


async def get_user(user_id: object) -> dict[str, object] | None:
    return None


# !snippet:start
class UserNotFoundError(inngest.NonRetriableError):
    # The run output's `name` is the exception's class name
    pass


@inngest_client.create_function(
    fn_id="my-fn",
    trigger=inngest.TriggerEvent(event="user"),
)
async def my_fn(ctx: inngest.Context) -> None:
    async def get_user_step() -> None:
        user = await get_user(ctx.event.data["userId"])
        if user is None:
            raise UserNotFoundError(
                f"User not found ({ctx.event.data['userId']})"
            )

    await ctx.step.run("get-user", get_user_step)
# !snippet:end
