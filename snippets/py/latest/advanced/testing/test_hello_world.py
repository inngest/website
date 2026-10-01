# !snippet:start
import inngest
from inngest.experimental import mocked

from .hello_world import hello_world

# A mock client: nothing is sent to an Inngest server.
client_mock = mocked.Inngest(app_id="test")


def test_hello_world() -> None:
    res = mocked.trigger(
        hello_world,
        inngest.Event(name="test/hello.world"),
        client_mock,
    )
    assert res.status is mocked.Status.COMPLETED
    assert res.output == "Hello World!"


# !snippet:end
