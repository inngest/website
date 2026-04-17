---
focus: false
heading: "Incident report for April 15, 2026 - Function scheduling and execution delays"
subtitle: A full report on the incident that caused significant delays in function scheduling and execution for all customers.
image: /assets/blog/2026-04-17-incident-report-for-april-15-2026/featured-image.png
date: 2026-04-17
author:
  - Dan Farrelly
  - Bruno Scheufler
category: engineering
---

On April 15, 2026, Inngest experienced a system-wide incident that caused significant delays in function scheduling and execution for all customers for approximately 19 hours. A spike in event volume on a specific function pattern overloaded a shared state store shard, which in turn cascaded into delays for run scheduling, async step operations (`step.waitForEvent`, `step.invoke`, `cancelOn`), event batching, and event and run observability.

Events sent to Inngest during the incident were not lost, and all affected function runs have since been processed. No data was lost as a result of this incident.

We sincerely apologize for the disruption this caused our customers. Reliability is the foundation of what we do at Inngest, and this incident fell short of the standard we hold ourselves to. Several fixes and mitigations have already been rolled out since the start of the incident and further improvements for tenant isolation in additional parts of our system is _our top engineering priority_.

The full timeline of the incident, root cause, and corrective actions are detailed below.

## Timeline

- **2026-04-15 03:00 UTC** Function run scheduling begins to slow down across the platform. CPU becomes saturated on a single shard (1 of 13) of our run state database (internally called: "state store"). Other shards remain in a healthy state.
- **2026-04-15 03:35-05:29 UTC** Alerts received indicating increased load, on-call engineers respond, performing routine scaling processing. Growing broader impact remained unclear and undetected.
- **2026-04-15 07:00 UTC** Monotonic memory growth begins on one of our queue shards (10 customers on shard identified).
- **2026-04-15 11:16 UTC** Alerts trigger for queue shard memory. On-call engineers respond to assess impact on system.
- **2026-04-15 12:15 UTC** Status page incident created as incident response team assessed customer impact.
- **2026-04-15 13:10 UTC** Inbound event and pause processing backlogs begin growing significantly. On-call engineers are paged.
- **2026-04-15 13:30 UTC** Root cause is pinpointed: growth in a high volume function using batch processing is repeatedly hitting the same state store shard due to shard key non-uniformity for batching. Bulk event cancellations from another workspace are adding pressure to pause processing.
- **2026-04-15 13:49 UTC** Manual failover triggered of saturated shard after earlier measures to address were unsuccessful.
- **2026-04-15 14:00 UTC** Accounts are migrated between queue shards to rebalance load. Executor capacity is scaled up.
- **2026-04-15 15:08 UTC** Failover completed for saturated shard, ending 100% saturation of single shard.
- **2026-04-15 15:10 UTC** Initiated scaling of 2 additional shards to state store cluster (13 to 15).
- **2026-04-15 15:38 UTC** 2 new shards join cluster. Rebalancing commences.
- **2026-04-15 15:40-18:50 UTC** Additional fixes and mitigations are performed (see below) to relieve pressure on the affected components and increase processing throughput. This includes enabling draining mode on problem functions.
- **2026-04-15 17:00 UTC** Two additional state store shards complete rebalancing.
- **2026-04-15 17:30 UTC** Inbound event backlog fully cleared.
- **2026-04-15 21:37 UTC** Async operations (`step.waitForEvent`, `step.invoke`, `cancelOn`) restored to normal latency.
- **2026-04-15 22:00 UTC** All backlogs fully cleared. **Incident resolved.**

## Root Cause

Inngest's platform routes run scheduling, batching, pause processing, and async step operations through a shared, horizontally sharded state store. Function run state is sharded uniformly by run ID, but batching uses the function ID as the shard key, which is non-uniform by design.

As events are received through our event stream, they are matched in realtime to the appropriate function triggers that are set by customers. These events are stored in our "state store" database with additional metadata then functions are scheduled by enqueuing them into the correct queue for that Inngest account. Run IDs are used to evenly distribute state across all shards.

When functions are configured with event batching, events for each _function_ are co-located on a shard which prevents batches from being distributed across shards to avoid cross-shard transactions and issues with leaky batches. Many functions handle millions of events, but typically, there is adequate cardinality and load across function ids to keep data evenly distributed across shards.

On April 15, a bug in Inngest's own SDK caused a customer's event volume to spike abnormally (50x+). This bug was in a SDK version which only affected step-less functions with `maxRuntime` configured and checkpointing enabled. This customer heavily relied on event batching in their functions. Because all batches for a given function land on the same shard, this concentrated load on a single state store node, pinning its CPU at 100%.

Because this storage layer is shared across the platform, the hot shard caused cascading latency for every customer's function scheduling, not just the one that triggered it. The degradation manifested as:

- Backlogs building up across several parts of the processing pipeline, as downstream consumers were blocked on slow upstream operations.
- Despite backlogs in function scheduling, the overall increased load caused a queue shard (where functions are enqueued after scheduling) memory to increase and executor workers for that shard became saturated.
- Significant memory pressure on shared infrastructure, approaching capacity limits, as work could not be processed fast enough.
- Slowed async operations (`step.waitForEvent`, `step.invoke`, `cancelOn`) processing.
  - This was further exacerbated by a high volume of programmatic bulk cancellations from customer workspaces. Bulk cancellations can include future timestamps which require the event stream consumer to match event payload expressions in realtime during scheduling.
- Delayed ingestion into our observability pipeline, which meant the dashboard event and run data was delayed even when scheduling was still making forward progress. This prevented customers from understanding if data was being processed.

Additionally, our system typically sees increased load during nightly periods as customers schedule large workloads to run in off-hours. This is consistent and usually subsides before a daily increase in morning hours for US timezones.

Three factors combined to produce an incident of this size: an bug in our SDK that amplified event volume for a high-throughput customer, insufficient tenant isolation in the state store and event stream layers, and the typical increased nightly load.

## Impact

- All customers experienced run scheduling delays from 03:00 UTC until 22:00 UTC (approximately 19 hours).
- All customers experienced async step operations (`step.waitForEvent`, `step.invoke`, `cancelOn`) processing delays from 13:00 UTC until 22:00 UTC (approximately 9 hours).
- Dashboard (event and run) observability was delayed due to slower ingestion into ClickHouse, even while scheduling continued to make forward progress.
- No events were lost. All runs that were scheduled during the incident window have since completed.

## Corrective actions

We have already shipped a number of fixes during and immediately after the incident, and we are now executing on a broader program of work to prevent this class of failure from recurring.

### Shipped during and after the incident

- Decoupled processing of batches to separate event stream topics and new services with dedicated containers and backlog management. The main event stream consumers that handle function scheduling no longer handle batches.
- Added two additional state store shards to rebalance load and reduce the blast radius of any single hot shard.
- Optimized batch idempotency deduplication by replacing a per-workflow sorted set (`ZADD`/`ZREMRANGEBYSCORE`, `O(log N)`) with per-event `SET NX EX` keys (`O(1)`), with a legacy fallback to reduce load on a given shard.
- Scaled up capacity across ingestion, scheduling, and execution components to drain backlogs as quickly as possible.
- Added safeguards to prevent batching on draining nodes of the batch republishing service.
- Added in-memory batching to reduce state store operations to reduce load on the state store database.
- Patched an SDK checkpointing bug that caused the upstream event amplification ([fix in v4.2.4](https://github.com/inngest/inngest-js/releases/tag/inngest%404.2.4)).
- Improved internal "drain mode" to prevent events from being added to batches, enabling the team to more quickly isolate problematic workloads. We also plan to add this as a feature in our API in the future.

### In progress

- **Review of all system metrics throughout the incident for earlier detection.** The 10-hour gap between scheduling delays beginning and our detection when delays increased significantly was a failure. We are performing an audit of all metrics and determining new metrics and indicators that should have alerted us when slowness started, before the state store shard became saturated.
- **New training, workflows, automations for faster customer notification via status page.** Even with our current alerting, our customers should have been notified via our customer status page much faster. We also are improving the visibility of active incidents within our dashboard.
- **Additional tenant isolation across the critical path.** We are actively working on further sharding event stream processing (function scheduling, async step operations, batching) by tenant groups and individual tenants and isolating the state store further to prevent noisy neighbor issues from degrading scheduling for others. This is now our top engineering priority.
- **Removing batching from the shared state store** **entirely**, so that batching load is permanently decoupled from run scheduling.
- **Moving cancellations off of unsharded storage**, so that bulk cancellations cannot create slowlogs that affect other workloads.
- **Decoupling the event data ingestion pipeline from the scheduling critical path**, so observability data is not delayed by backups with function scheduling.
- **Reviewing and honoring SLA commitments** for contracted users. We will be proactively reaching out to contracted customers.
- **New SLOs and improved alerting on state store CPU, I/O, and per-tenant latency**, so we detect and page on hot-shard conditions well before they cause customer impact.
  - Our team already has a major project under way to migrate our state store database to another technology and self-host this to have additional control over this part of the stack. Our database is currently managed by a cloud vendor and this limits our operational control and speed of recovery.

## In closing

We know that many of our customers depend on Inngest as critical infrastructure for quick and timely execution, and a 19-hour scheduling delay is not acceptable. We are deeply sorry for the impact this had on your products and your own customers.

The underlying cause, insufficient tenant isolation with our shared state store, is something we have been working to eliminate, and this incident makes clear that we need to move faster. Tenant isolation, better and earlier alerting on our critical path, and a decoupled data ingestion pipeline are now the top priorities for our systems and platform teams, with work already in progress.

We will publish follow-up updates as this work lands. If you have any questions about this incident or how it affected your workloads, please reach out to [our support team](https://support.inngest.com) and we will be happy to walk through the specifics with you.

Thank you for your patience and for your continued trust in Inngest.
