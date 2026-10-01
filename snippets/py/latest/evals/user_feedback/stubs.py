import typing


async def run_agent(question: str) -> str:
    return question


async def investigate(data: object) -> dict[str, typing.Any]:
    return {"cited_files": []}


async def post_rca(incident_id: str, rca: dict[str, typing.Any]) -> None:
    return None


class _Answers:
    async def insert(self, *, id: str, run_id: str, answer: str) -> None:
        return None

    async def get(self, id: str) -> dict[str, str]:
        return {"run_id": "01H"}


class _DB:
    answers = _Answers()


db = _DB()
