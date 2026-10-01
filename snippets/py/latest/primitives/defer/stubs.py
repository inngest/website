import inngest
from inngest.experimental import create_defer

from .client import inngest_client


@create_defer(inngest_client, fn_id="send-email-stub")
async def send_email(ctx: inngest.Context) -> None:
    return None


@create_defer(inngest_client, fn_id="feedback-scorer")
async def feedback_scorer(ctx: inngest.Context) -> None:
    return None


@create_defer(inngest_client, fn_id="judge-results")
async def judge_results(ctx: inngest.Context) -> None:
    return None


async def sync_data(data: object) -> dict[str, int]:
    return {"rowCount": 0}


MINIMUM_ROWS_WORTH_JUDGING = 100

my_functions: list[inngest.Function[object]] = []
