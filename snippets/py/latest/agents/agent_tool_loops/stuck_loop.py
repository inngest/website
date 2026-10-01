def stuck_loop(
    iterations: int, last_three_tools: list[str], prev_tool: str
) -> bool:
    done = False
    # !snippet:start
    if iterations > 3 and all(t == prev_tool for t in last_three_tools):
        done = True
    # !snippet:end
    return done
