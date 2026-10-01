import dataclasses

from inngest.experimental.experiment import ExperimentRef


async def summarize(*, model: str, text: str) -> str:
    return text


class _Rollout:
    async def get(self, account_id: str) -> str | None:
        return None


rollout_table = _Rollout()


@dataclasses.dataclass
class Saved:
    experiment_ref: ExperimentRef
    run_id: str
