from .stubs import Database

# !snippet:start
import typing

import inngest

# Assumes `Database` is your own database client.
db = Database()


class DatabaseMiddleware(inngest.Middleware):
    async def transform_input(
        self,
        ctx: inngest.Context | inngest.ContextSync,
        function: inngest.Function[typing.Any],
        steps: inngest.StepMemos,
    ) -> None:
        # The context has no typed extension point, so attach the client as
        # an attribute.
        setattr(ctx, "db", db)


def get_db(ctx: inngest.Context | inngest.ContextSync) -> Database:
    """Return the database client added by DatabaseMiddleware."""
    return typing.cast(Database, getattr(ctx, "db"))


inngest_client = inngest.Inngest(
    app_id="my-app",
    middleware=[DatabaseMiddleware],
)
# !snippet:end
