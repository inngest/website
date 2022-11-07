---
focus: true
heading: "Replacing queues using an event-driven architecture"
subtitle: Rebuilding queueing and scheduling infrastructure with modern tooling
image: "/assets/blog/replacing-queues-using-event-driven-architecture/featured-image.png"
author: Tony Holdstock-Brown
date: 2022-11-07
---

A lot of developers haven't yet adopted event-driven architectures. That makes sense. To start, people don't want to over-engineer solutions by spending weeks configuring subscribers, throttling, idempotency, and dead letters. And that there’s an assumption that events are used for data "at scale", instead of for regular development.

This is definitely true for global-scale apps, like Uber. Most apps, though, still process webhooks and offload logic to background jobs.

Background processing is becoming even more important as people APIs to the edge: APIs should respond as fast as possible, deferring all work to some other task where possible.

So what happens now? Most people opt to use a queueing system such as RabbitMQ, SQS, or Celery to handle their async logic. Or you try and chain Lambdas via HTTP calls. This works, but while the overlap between queues and event streams is large they’re not a 1—1 match, which means there’s a lot left on the table we can improve.

![A worker consuming messages from a queue via RPC](/assets/blog/replacing-queues-using-event-driven-architecture/queue-worker.png)

For example: queues aren’t fan-out, they’re RPC. Need to run more than one job? That’s multiple API calls. And events don’t retry specific subscribers by default — it’s your job to figure out and retry individual workers by nacks or re-reading from topic offsets. It really depends on the streaming implementation you choose, too.

At Inngest, we’ve been working on a way to merge event streams and queues into a single platform, giving you the best of both worlds.

Here’s how it works:

1. Whenever you want to run jobs in the background, you send “event” to Inngest. The event tells your system what happened (eg. a user signed up, a photo was uploaded, an order was created, a charge was attempted).
2. You write serverless functions hosted on your current provider that respond to these events. You can have many functions listen to the same event.
3. Whenever an event is received, all of your relevant functions run in the background, in parallel, automatically.
4. If functions fail (eg. an API is down), we’ll retry the function automatically — because we mix queues and event streams.

This is incredibly powerful. If you’re building at the edge, you can send a single event which triggers multiple background jobs automatically, making your APIs as fast as they can be. You also don’t have to worry about stateful servers — the system calls your functions automatically, and sending an event is a plain HTTP call.

And, because everything is an event, we store them in an event store for observability, replay, strict typing, and retries, giving you a clear picture of your systems for free.

We’re excited to see how this platform improves your productivity. [The core of the platform’s source is available on github](https://github.com/inngest/inngest), and you can get started with the SDK in a few lines. We’d love to hear your ideas for it in our [discord](https://www.inngest.com/discord) or via [twitter](https://twitter.com/inngest) — please get in touch!
