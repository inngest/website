---
heading: "Inngest: OS v0.5 released"
subtitle: This release contains exciting new functionality, including replay and our self-hosting services
date: 2022-07-26
dateUpdated: 2026-01-07
image: "/assets/blog/release-v0.5.0.jpg"
tags: release-notes
---

> **📢 Latest version:** This blog post covers Inngest v0.5.0 from July 2022. For information about the latest version of Inngest, including self-hosting support and recent features, see [**Announcing Inngest self-hosting (v1.0)**](/blog/inngest-1-0-announcing-self-hosting-support).

[Inngest v0.5.0 is here](https://www.github.com/inngest/inngest)! This release contains _exciting_ new functionality to improve your lives as a developer, as well as routine improvements. Some of the highlights which we'll dive into:

- **Historic replay,** which allows you to locally test your functions with _real production data_
- **Self-hosting beta,** so that you can host Inngest in your own environment

Read more about our [future plans in our roadmap](https://github.com/orgs/inngest/projects/1), and if you want to propose new features or ideas feel free to [start a discussion](https://github.com/inngest/inngest/discussions) or [chat with us in discord](/discord). Let’s dive in!

## Replay past events

This release brings an exciting new feature to `inngest run`: **easily testing your local functions against real, production data.**

This lets you ensure that your function works exactly as intended with real events that are flowing through your system — giving you more confidence than relying on unit testing or dummy data only.

Best of all, it’s really simple to use:

```
inngest run --replay
```

How is this possible? Inngest is event-driven, and we store all of the events that flow through your system. This lets us take those historic events and pipe them through to your local functions. It’s a completely different approach than you might be used to with eg. SQS or RabbitMQ, which enables much better development practices than previously available.

You can ~~read the documentation for historic replay here~~ (**NOTE** - This has been deprecated in favor of [the Inngest SDK](/docs/getting-started/nextjs-quick-start)).

## Self hosting beta

While we offer our [hosted cloud](https://app.inngest.com/sign-up?ref=v0.5.0) which lets you start using Inngest in minutes, we’ve also added a new command to the CLI: `inngest serve`. This lets you run the core Inngest services to accept events, initialize functions, execute functions, and deploy new versions to your own infrastructure. The backends are entirely configurable; you can choose any messaging system for processing incoming events by [changing your config file](https://github.com/inngest/inngest/blob/main/pkg/cuedefs/config/config.cue).

We’ve benchmarked with (self-hosting)[/docs/self-hosting] stacks running on AWS. We’ve also added some benchmarking:

- A single 1GB / 0.5vCPU event API can process 110 requests per second with a p99 latency of 35ms, without breaking ~35mb ram usage.
- It’s easy to scale to thousands of requests per second, as the services themselves are shared nothing.

If you’re interested in self-hosting, you can [read the docs here](/docs/self-hosting) and [chat with us on discord](/discord) if you have any questions

## Other changes

We’ve also made several changes to the open-source state interface. We now include a distributed waitgroup which tracks the number of outstanding steps in a function. This lets the `inngest run` command know when a function is complete — necessary for a smoother dev UX.

We've also changed the way the dev server works under the hood. It now better matches self hosting environments by using the exact same services as in self-hosting.

## Updates: What's changed since this blog was published

### 2025 Updates

**Checkpointing: Near-zero latency for durable workflows (December 2025)**  
Enable checkpointing to achieve near-zero inter-step latency while maintaining durability. Results show 50% reduction in workflow duration. [View changelog](https://www.inngest.com/changelog/2025-12-10-checkpointing) | [Learn more](/docs/setup/checkpointing)

**Dev Server MCP (October 2025)**  
AI-assisted development workflows with Model Context Protocol. Connect Claude Code, Cursor, and other AI assistants to test and debug functions locally. [View changelog](https://www.inngest.com/changelog/2025-10-27-dev-server-mcp) | [Learn more](/docs/ai-dev-tools/mcp)

**New webhook content types (August 2025)**  
Support for `x-www-form-urlencoded` and `multipart/form-data` content types. [View changelog](https://www.inngest.com/changelog/2025-08-27-new-webhook-content-types) | [Learn more](/docs/guides/webhooks)

**Realtime support for Python (September 2025)**  
Build interactive applications that push updates from durable workflows to the browser. [View changelog](https://www.inngest.com/changelog/2025-09-26-python-realtime-beta) | [Read blog](/blog/announcing-realtime)

**Zod 4 and Standard Schema support (September 2025)**  
TypeScript SDK now supports Standard Schema interface, allowing use of Zod 4, Valibot, ArkType, joi, and more. [View changelog](https://www.inngest.com/changelog/2025-09-26-zod-4-standard-schema-support) | [Learn more](/docs/reference/client/create#defining-event-payload-types)

**AgentKit: useAgent hook (September 2025)**  
Stream realtime updates from AgentKit agents to the browser with `useAgent` and `useChat` hooks. [View changelog](https://www.inngest.com/changelog/2025-09-24-agentkit-use-agent) | [Learn more](/docs/ai/agentkit)

**Inngest Insights: Query events with SQL (September 2025)**  
Query your events with SQL directly in the Inngest dashboard. [View changelog](https://www.inngest.com/changelog/2025-09-23-insights) | [Read blog](/blog/insights-query-events-and-runs)

**step.run in REST APIs (September 2025)**  
Make any API endpoint durable and observable with step.run. Available in Go SDK, TypeScript coming soon. [View changelog](https://www.inngest.com/changelog/2025-09-22-step-run-in-apis-golang) | [Read blog](/blog/step-run-in-rest-apis)

**Advanced Event Search (July 2025)**  
Advanced event filters using CEL expressions. [View changelog](https://www.inngest.com/changelog/2025-07-23-event-search) | [Learn more](/docs/platform/monitor/events)

**Singleton Functions: Cancel Mode (June 2025)**  
New `cancel` mode for Singleton Functions to cancel existing runs and start fresh. [View changelog](https://www.inngest.com/changelog/2025-06-23-singleton-functions-cancel-mode) | [Learn more](/docs/guides/singleton)

**Introducing Connect (June 2025)**  
Persistent outbound connections for lower latency, elastic scaling, and simpler long-running steps. Ideal for container runtimes. [View changelog](https://www.inngest.com/changelog/2025-06-20-connect) | [Learn more](/docs/setup/connect)

**Datadog metrics export (June 2025)**  
Export Inngest metrics to Datadog for centralized monitoring and alerting. [View changelog](https://www.inngest.com/changelog/2025-06-13-datadog-metrics-export) | [Learn more](/docs/platform/monitor/datadog-integration)

**Singleton Functions (June 2025)**  
Exclusive execution control for Inngest functions. [View changelog](https://www.inngest.com/changelog/2025-06-06-singleton-functions) | [Learn more](/docs/guides/singleton)

**Realtime Updates (May 2025)**  
Stream updates from Inngest functions to users with secure, low-latency delivery. [View changelog](https://www.inngest.com/changelog/2025-05-19-realtime) | [Read blog](/blog/announcing-realtime)

**Fetch APIs: step.fetch() (May 2025)**  
Make durable HTTP requests within functions by offloading to the Inngest platform. [View changelog](https://www.inngest.com/changelog/2025-05-09-step-fetch) | [Read blog](/blog/step-fetch-durable-http-requests)

**Prometheus metrics export (February 2025)**  
Export Inngest metrics to Prometheus for existing monitoring systems. [View changelog](https://www.inngest.com/changelog/2025-02-11-prometheus-metrics-export) | [Learn more](/docs/platform/monitor/prometheus-integration)

**Webhook management API (February 2025)**  
Programmatically create, update, and delete webhooks via REST API. [View changelog](https://www.inngest.com/changelog/2025-02-11-webhooks-api) | [Learn more](https://api-docs.inngest.com/docs/inngest-api/b539bae406d1f-get-all-webhook-endpoints-in-given-environment)

**Postgres support for self-hosting (January 2025)**  
Use Postgres as event storage backend instead of SQLite. Available in CLI v1.4.0+. [View changelog](https://www.inngest.com/changelog/2025-01-20-postgres-self-hosting) | [Learn more](/docs/self-hosting)

### 2024 Updates

**New inngest/function.cancelled event (November 2024)**  
System event for handling cancelled runs gracefully. [View changelog](https://www.inngest.com/changelog/2024-11-25-function-cancelled-event) | [Learn more](/docs/reference/events/inngest-function-cancelled)

Happy building!
