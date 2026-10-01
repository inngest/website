import typing

Tool = dict[str, typing.Any]

search_tool: Tool = {}
read_file_tool: Tool = {}
write_file_tool: Tool = {}
delegate_task_tool: Tool = {}
delegate_background_tool: Tool = {}
TOOLS: list[Tool] = []
SYSTEM_PROMPT = "You are a helpful assistant."
REPORT_WEBHOOK_URL = "https://example.com/reports"


async def call_llm(
    messages: list[dict[str, typing.Any]], tools: list[Tool]
) -> dict[str, typing.Any]:
    raise NotImplementedError


async def execute_tool(name: str, arguments: dict[str, typing.Any]) -> str:
    raise NotImplementedError


async def notify_user(session_id: str, response: str) -> None:
    raise NotImplementedError
