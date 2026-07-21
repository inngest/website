---
tags:
  [
    "AI & Agents",
    "Workflows & Orchestration",
    "Background Jobs & Scheduling",
    "Tutorials & Guides",
  ]
heading: Background agents are here. Your orchestration isn't ready.
subtitle: Every six months, the "right" way to build an AI agent changes. How can you design for the next rewrite?
image: /assets/blog/background-agents-are-here/featured-image-gold.png
date: 2026-05-08
author: Dan Farrelly
primaryCTA: "report2026"
---

Every six months, the "right" way to build an AI agent changes.

We went from RAG being the consensus and everyone got their vector DBs, then to ReAct. We need virtual memory to solve this 4k context problem! Wait context windows are huge now. Now Anthropic dropped a blog post - we're prompt chaining, routing, creating orchestrator-workers! Context engineering is the real work. We need a browser for this, no MCP is the future. We're building tons of specialized sub-agents with funny human-sounding roles. Nope, models got better, generic agents with great prompts are king. Wow OpenAI jumped on MCP, it's definitely the future. CLIs are it now, MCPs are out. Now we need a sandbox, but how fast can it spin up? We are making software factories. What about syncing context across agents?...

If you coupled your infrastructure to any one of these patterns, you've already rebuilt at least twice. And you'll rebuild again.

Here's the thesis: [there's a layer that doesn't change](/blog/your-agent-architecture-has-a-half-life?ref=blog-background-agents-are-here). Durable orchestration: steps, events, state, retries, observability. Every pattern listed above runs on top of these same primitives. If you have this layer covered, changing agent patterns is easier. Get it wrong, every pattern shift is a rewrite or a migration.

## The framework trap

Agent frameworks aren't libraries. They're bets on which agent pattern wins. When the pattern shifts, you don't refactor; you rewrite.

LangGraph encodes graph-based control flow as the paradigm. CrewAI encodes role-based agents. AutoGen encodes conversational multi-agent. Each is optimized for one view of how agents should work, and each becomes a liability when that view changes. (LangChain itself [has already moved onto "deep agents,"](https://www.reddit.com/r/LangChain/comments/1padbzr/langchain_vs_langgraph_vs_deep_agents/) and AutoGen is in maintenance mode as Microsoft shifted to Microsoft Agent Framework. Case in point.)

When Anthropic published their [agent patterns guide](https://www.anthropic.com/engineering/building-effective-agents), it invalidated assumptions baked into half the frameworks in the ecosystem. Their explicit advice: start with raw LLM APIs and avoid frameworks that obscure prompts and responses. Their exact words: "incorrect assumptions about what's under the hood are a common source of customer error." Of course they have their own incentives, but it's still valid.

The problem isn't abstraction. Abstraction is fine. The problem is coupling. Abstract the primitives: steps, retries, state. Don't abstract the topology. Swapping from one framework approach to a planning-first loop means rewriting your entire agent, not swapping a component.

I've written about this before: [why agents need a harness, not a framework](/blog/your-agent-needs-a-harness-not-a-framework?ref=blog-background-agents-are-here). The core idea is that your agent logic should be wrapped in a stable execution layer, not embedded in a framework's control flow. The harness stays. The agent logic changes.

## What actually stays the same

Five primitives show up underneath every pattern:

- **Durable steps** - work checkpoints so an error mid-loop doesn't lose 40 minutes of progress.
- **Persistent external state** - survives process crashes and deployments.
- **Parallel work coordination** - fan-out/fan-in, parallel tool calls, sub-agent delegation.
- **Event-driven control flow** - pause and wait for a signal (e.g. Human-in-the-loop, cancellation) without holding a connection open.
- **Structured execution observability (traces)** - every step and every decision, inspectable to debug specific and broad issues.

These primitives don't encode an agent pattern. They encode execution guarantees. You compose them into whatever pattern you need today and recompose them when the pattern changes tomorrow. I went deeper on specific composition patterns in [Three sub-agent patterns you need for your agentic systems](/blog/three-patterns-you-need-for-agentic-systems?ref=blog-background-agents-are-here). Delegation, fan-out, and orchestrator-worker all rely on these same primitives underneath.

A ReAct loop, a planning agent, and a multi-agent delegation pattern all reduce to the same `step.run()` and `step.invoke()` calls. [Agent loops](/docs/ai-patterns/agent-tool-loops?ref=blog-background-agents-are-here), [HITL](/docs/ai-patterns/human-in-the-loop?ref=blog-background-agents-are-here), and [delegation](/docs/ai-patterns/sub-agent-delegation?ref=blog-background-agents-are-here) can just be built on these primitives.

## The background agent gap

The next major pattern shift is already happening: from synchronous chat agents to asynchronous background agents. This is where most infrastructure falls apart, and where durable orchestration becomes non-negotiable.

The previous paradigms were mostly synchronous, chat-like experiences. API requests are sent and everything around the LLM is fairly limited and simple. After all, it has to be as fast as possible for the user experience.

As models and approaches have improved, agents can take on long-horizon tasks for minutes or hours at a time. Agent loops span hundreds of steps (LLM calls and tool calls). All successful applications require async background work - the tasks simply take too long for a synchronous user experience.. The base set of problems is the same, but with some new ones.

Background agents need a few things to be successful:

**Long-running execution with crash recovery.** The longer something runs, the higher the cost of failure. A 45-minute agent run can't live in a Lambda with a 5-minute timeout. It can't live in memory on a single process. It needs execution that survives restarts, deployments, and infrastructure failures (see: [durable execution](/platform/durable-execution)).

**Multi-step observability.** When a background agent produces a bad result 30 minutes into a run, you need to trace every step it took. Every LLM call, tool invocation, decision point, and sub-agent delegation. Cobbling together logs and state isn't going to cut it.

**Event-driven control flow.** Background agents need to pause and wait for external input or triggers (human approval, webhook data, another agent's result, agent result feedback) without blocking a thread or holding a connection open. Agents need to sleep and be woken up.

**Lifecycle controls.** Teams often cobble together DB queries, tools to search logs, hooks to cancel in-progress jobs, and build custom scheduling to get some sort of handle on async work. You either adopt something that gives you lifecycle control (status, cancellation, scheduling, inspection) or you build a fragile version of this that needs to be maintained over time as you scale.

### What about sandboxes?

One might argue: don't sandbox providers already solve this? They solve a different problem. Sandboxes operate at the compute layer — they answer "where does the agent run?" Some pause and resume the full VM state, which is powerful, but it's a runtime snapshot, not a workflow snapshot. They can't tell you which steps completed, what they returned, or where to resume without re-executing work that already succeeded.

Some folks run a harness within the sandbox itself (e.g. Claude Code, OpenCode). This typically embeds the harness's state in the filesystem of the sandbox, making the sandbox's VM snapshots the durability layer. It turns the sandbox provider into the "orchestration" provider by accident. Actual agent orchestration is now split across multiple layers with mixed levels of observability and durability.

The two layers are complementary, but conflating them is a costly mistake on the road to production. The orchestration layer should sit above the sandboxes, managing the lifecycle of sandboxes and retaining state.

## The composability argument

Durable orchestration isn't just about reliability. It's about composability. The primitives compose into patterns that don't have names yet.

Today's patterns (ReAct, planning, multi-agent) are not the final patterns. New model capabilities will create new architectures we can't predict. If your primitives are composable, new patterns are just new compositions. Not new infrastructure.

When you have `step.run()`, `step.invoke()`, `step.waitForEvent()`, and `step.sleep()`, you can build things that don't fit neatly into any existing taxonomy:

- Delegate to 5 sub-agents, wait for the first 3 to complete, cancel the other 2, and synthesize partial results before continuing.
- Create autoresearch-like pipeline that runs nightly evals on agent traces, and automatically updates system prompts or tool selection based on what's actually working.
- Run the same task with two different prompt strategies in parallel, wait for both to complete, score the results, and record which variant won — building a dataset over time.

Patterns change faster than ever. They're all compositions. Frameworks struggle to adapt for these things as they encode a fixed topology. Composable primitives don't have that same issue.

There's another angle here that's easy to miss: [teams with strong orchestration and observability iterate faster](/blog/ai-in-production-report-2026?ref=blog-background-agents-are-here). When you can see every step of every agent run (structured, not just logs) you can identify what's working and swap what isn't. **The composability gap is really an observability problem.** You can't recompose what you can't see.

## What this looks like in practice

![A diagram of the layers of architecture for building agents.](/assets/blog/background-agents-are-here/layers-dark.gif)

This isn't theoretical. Here's how it maps to real infrastructure decisions.

**The [orchestration layer](/blog/agent-loop-architecture?ref=blog-background-agents-are-here-your-orchestration-isnt-ready) (stable).** Durable execution, step primitives, event system, state management, observability, scheduling. This is your multi-year decision. It doesn't change when agent patterns change.

**The agent layer (fluid).** How you structure LLM calls, tool use, reasoning, delegation. This changes every 3-6 months. It should be easy to change because it's just application code running on durable primitives.

**The model layer (volatile).** Which LLM you call, which API, which provider. This changes monthly. It should be a single line change, not an architecture change.

## Design for the rewrite

Agent topologies have a shelf life. The one you're building now won't be the one you're running in six months. New models, new research, new patterns — this is a constant, not a problem.

Design around it. An orchestration layer with the right primitives enables your team to adapt quickly. Let everything above it change as fast as it needs to.

Background agents aren't coming. They're here. The only question is whether your infrastructure is ready to let them run, or whether you're about to rebuild it again.
