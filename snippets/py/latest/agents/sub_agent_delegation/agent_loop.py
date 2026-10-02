import typing

import inngest


async def run_agent_loop(
    ctx: inngest.Context,
    *,
    system_prompt: str,
    session_id: str,
    tools: list[dict[str, typing.Any]],
    max_iterations: int,
) -> dict[str, typing.Any]:
    """Stands in for your agent loop (see Agent tool loops)."""
    raise NotImplementedError
