# !snippet:start
import logging
import time
import typing

import inngest

logger = logging.getLogger(__name__)


# Python middleware hooks run around new code (usually one step.run handler)
# rather than around a specific step handler.
class StepTimingMiddleware(inngest.Middleware):
    def __init__(self, client: inngest.Inngest, raw_request: object) -> None:
        super().__init__(client, raw_request)
        self._run_id: str | None = None
        self._started_at: float | None = None

    async def transform_input(
        self,
        ctx: inngest.Context | inngest.ContextSync,
        function: inngest.Function[typing.Any],
        steps: inngest.StepMemos,
    ) -> None:
        self._run_id = ctx.run_id

    async def before_execution(self) -> None:
        self._started_at = time.perf_counter()

    async def after_execution(self) -> None:
        if self._started_at is None:
            return
        logger.info(
            "step duration",
            extra={
                "run_id": self._run_id,
                "duration_ms": (time.perf_counter() - self._started_at) * 1000,
            },
        )


inngest_client = inngest.Inngest(
    app_id="my-app",
    middleware=[StepTimingMiddleware],
)
# !snippet:end
