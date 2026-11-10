from inngest.experimental.sandbox import DurableSandbox


async def run_agent(sb: DurableSandbox, run_token: str) -> None:
    # !snippet:start
    await sb.commands.run(
        "agent",
        "node agent.js",
        environment={
            "ANTHROPIC_BASE_URL": "https://app.example.com/llm",
            "ANTHROPIC_API_KEY": run_token,
        },
    )
    # !snippet:end
