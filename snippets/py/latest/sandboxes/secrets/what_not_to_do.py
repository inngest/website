import inngest
from inngest.experimental.sandbox import DurableSandbox


async def mint_token() -> str:
    return "token"


async def leak(ctx: inngest.Context, sb: DurableSandbox) -> None:
    # !snippet:start
    token = await ctx.step.run("mint", mint_token)

    await sb.files.upload("env", "/work/.env", f"TOKEN={token}")

    await sb.commands.run(
        "call-api",
        f"curl -H 'Authorization: Bearer {token}' https://api.example.com",
    )
    # !snippet:end
