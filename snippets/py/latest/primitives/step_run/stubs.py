import typing


async def load_task(task_id: typing.Any) -> dict[str, str]:
    return {"id": str(task_id)}


async def process_task_record(task: dict[str, str]) -> dict[str, bool]:
    return {"ok": True}
