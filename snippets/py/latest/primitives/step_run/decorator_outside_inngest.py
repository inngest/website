from inngest.experimental import step


@step("prepare-greeting")
def prepare_greeting(name: str, *, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}!"


assert prepare_greeting("Ada", greeting="Welcome") == "Welcome, Ada!"
