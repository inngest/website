import inngest


# !snippet:start
class A(inngest.MiddlewareSync):
    def before_execution(self) -> None:
        pass

    def after_execution(self) -> None:
        pass


class B(inngest.MiddlewareSync):
    def before_execution(self) -> None:
        pass

    def after_execution(self) -> None:
        pass


inngest.Inngest(
    app_id="my-app",
    middleware=[A, B],
)
