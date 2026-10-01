import typing

import inngest

client = inngest.Inngest(app_id="my-app")
functions: list[inngest.Function[typing.Any]] = []
