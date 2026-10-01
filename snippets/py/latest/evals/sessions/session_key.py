import inngest

good = inngest.Event(
    name="x",
    # !snippet:start
    # Do this
    meta={"sessions": {"conversation_id": "conv_1234"}},

    # Not this
    # meta={"sessions": {"conversation_id:conv_1234": "true"}},
    # !snippet:end
)
