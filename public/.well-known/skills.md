# Inngest Agent Skills

> Pre-built skills for AI coding agents that teach Claude Code, Cursor, Windsurf, and other agents how to write, test, and debug Inngest functions with up-to-date API knowledge.

- Source: https://github.com/inngest/inngest-skills
- Documentation: https://www.inngest.com/docs/ai-dev-tools/agent-skills
- Full Inngest docs (LLM-friendly): https://www.inngest.com/llms.txt

## Installation

### skills.sh
```bash
npx skills add inngest/inngest-skills
```

### Claude Code
```
/plugin marketplace add inngest/inngest-skills
/plugin install inngest-skills@inngest-agent-skills
```

### Cursor
Add to your `.cursorrules` file:
```
Load the Inngest skills from https://github.com/inngest/inngest-skills for building with Inngest's durable execution platform.
```

### Windsurf / other agents
Reference https://github.com/inngest/inngest-skills directly or clone it to your agent's skills directory. Each skill is self-contained with full documentation in its `SKILL.md` file.

## Available Skills

| Skill | Description | What it covers |
| --- | --- | --- |
| **inngest-setup** | Set up Inngest in a TypeScript project | SDK installation, client config, environment variables, dev server |
| **inngest-events** | Design and send Inngest events | Event schema, naming conventions, idempotency, fan-out patterns, system events |
| **inngest-durable-functions** | Create and configure durable functions | Triggers, step execution, memoization, cancellation, error handling, retries |
| **inngest-steps** | Use step methods to build durable workflows | `step.run`, `step.sleep`, `step.waitForEvent`, loops, parallel execution |
| **inngest-flow-control** | Configure flow control for functions | Concurrency limits, throttling, rate limiting, debounce, priority, batching |
| **inngest-middleware** | Create middleware for cross-cutting concerns | Middleware lifecycle, dependency injection, built-in middleware |

## Language Support

These skills are currently focused on **TypeScript**. Core concepts like events, steps, and flow control apply across all Inngest SDKs, but code examples and setup instructions are TypeScript-specific.

For Python or Go, refer to https://www.inngest.com/llms.txt for language-specific guidance.

## Related

- [Dev Server MCP Integration](https://www.inngest.com/docs/ai-dev-tools/mcp) — Connect AI assistants directly to your running Inngest dev server to list functions, send events, and monitor runs alongside these skills.
