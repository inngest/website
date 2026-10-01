import inngest

from .stubs import send_email


async def fn(ctx: inngest.Context, defer_id: str, data: dict[str, object]) -> None:
    function = send_email
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    handle = ctx.defer(defer_id, function=function, data=data)
    # !snippet:end
    handle.abort()
