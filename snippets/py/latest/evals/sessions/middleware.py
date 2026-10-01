# !snippet:start
# Requires the inngest release after 0.5.19.
import inngest


class SessionPolicy(inngest.Middleware):
    # Runs for ctx.step.send_event() and inngest_client.send(). Python
    # middleware doesn't see the event that ctx.step.invoke() sends.
    async def before_send_events(self, events: list[inngest.Event]) -> None:
        for event in events:
            propagated = (event.meta or {}).get("propagated_sessions")
            if propagated is not None:
                propagated.pop("internal_trace_id", None)
# !snippet:end
