---
focus: false
featured: false
heading: "Incident report for September 18, 2026 - Database connection exhaustion"
subtitle: A report on the database connection pool exhaustion that interrupted run scheduling and event processing.
image: /assets/blog/incident-post-mortem.svg
date: 2026-09-18
author:
  - Jakob Evangelista
  - Muzammil A.
  - Albert Chae
  - Bruno Scheufler
category: engineering
---

_All timestamps are in UTC._

## Summary

On September 18, 2026, a single account deletion originating from our Vercel Marketplace integration, retried ten times, blocked our primary Postgres database for long enough to exhaust the connection pool in front of it. Services across the platform could not reach the database, which stalled run scheduling and event acknowledgement.

There were two periods of impact: 16:18 to 16:42, and a second, slightly larger one from 17:50 to 18:12 that occurred while we were rolling out the mitigation.

Events sent to Inngest during the incident were durably accepted, and scheduling resumed once the blocking transactions cleared. Affected work was delayed rather than lost.

## What Happened

At 15:39:39, our Vercel Marketplace integration received an installation deletion and began deprovisioning the corresponding Inngest account. The request path was: Vercel installation deletion, to marketplace deprovisioning, to a cascading account delete.

Vercel requires hard deletion rather than the soft deletion we use everywhere else in the product. Our deprovisioning path therefore deletes the user inside a transaction and then issues a real `DELETE` against the account row. That second statement cascades: accounts and workspaces are referenced by foreign keys from dozens of tables, most declared `ON DELETE CASCADE`. One account deletion fans out into deletes across a large portion of the schema, inside one transaction, holding locks on everything it touches until it commits.

This first cascade ran far longer than expected. We have not yet established why; the historical logs do not preserve the complete database blocking chain.

What turned a slow transaction into an outage was the retry behavior around it. Between 15:41 and 15:56, ten additional deletion attempts arrived for the same installation and the same account. Each one tried to delete rows the first transaction already held locks on, so instead of failing fast they queued behind it. One user-delete query ended up waiting 44 minutes. Lock counts on the primary climbed from a baseline of roughly 540 to a peak of 9,269 at 16:16, and active backend connections rose from about 180 to just over 1,000.

Blocked queries do not release their connection. Each one continued to occupy a client slot in PgBouncer for the entire wait, and the pressure spread to every service sharing that pool, including services with no relationship to the deletion. PgBouncer client connections went from a steady 427 to 6,066, with 5,933 of them waiting for a server connection. From 16:09 the pooler queues grew steadily, and by 16:18–16:19 both PgBouncer hosts had hit their 3,000 client limit. They began rejecting new connections and disconnecting waiting clients at the 120 second wait timeout:

```
FATAL: no more connections allowed (max_client_conn) (SQLSTATE 08P01)
```

At that point the failure was platform-wide. Run scheduling volume dropped, inbound events stopped being acknowledged, Connect gateway message forwarding and Constraint API throughput fell, checkpointing latency breached its SLO, and several services entered crash loops because they could not reach the database on startup.

We restarted the PgBouncer instances at 16:26. This was after the pools had already saturated, and it did not address the cause: the blocking transactions were still running, so the pools refilled. The restart also surfaced an unrelated problem, a missing runtime directory, which slowed our recovery further.

The first period of impact ended when we cancelled the blocking queries. At 16:39 we cancelled nine of the user deletions along with the original account deletion. Lock counts cleared at approximately 16:42 and dependent services recovered over the following minutes.

### The recurrence during rollout

Cancelling the queries removed the symptom but not the source. Deletion requests were still arriving and still being processed, so we prepared a kill switch to stop the deletion path outright.

At 17:45 the same pattern began again. Waiting clients climbed from zero, average query times rose from 16 ms to 604 ms, and Postgres active backends reached 720. The kill switch merged at 17:54:21 and began rolling out into a system that was already contending, and by 18:00 both poolers were saturated again — 6,102 client connections with 5,971 waiting, `maxwait` pinned at the 120 second timeout, and average query time at 20 to 22 seconds. This was marginally worse than the first peak.

The second wave produced broader service impact than the first: executor, batches, pauses, new-runs, queue-proxy, debug-api and CDC services crash-looped, two queue shards stopped processing, and a batches backlog built up. Across both periods, twelve separate incidents were merged into this one during the first wave and a further twelve during the second.

Recovery came at approximately 18:12. One detail is worth calling out: Postgres lock counts had already fallen back to baseline by 18:00, while PgBouncer stayed saturated for another eight to ten minutes. Once every client slot is held by a waiting query, the pooler does not recover on the database's timescale — the queue has to drain first. By 18:15 waiting clients were at zero and query times were back to 15–16 ms.

## Timeline

- **15:39:39:** A Vercel Marketplace installation deletion begins. The user is deleted inside a transaction, and the cascading account delete starts.
- **15:41–15:56:** Ten further deletion attempts arrive for the same installation and account. They queue behind the first transaction; one waits 44 minutes.
- **16:09:** PgBouncer client queues begin growing.
- **16:16:** Database locks peak at 9,269, roughly seventeen times baseline.
- **16:18–16:19:** Both PgBouncer hosts reach the 3,000 client limit and begin rejecting connections and disconnecting clients at the 120 second wait timeout.
- **16:21:44:** We declare an incident and page on-call.
- **16:22:47:** `max_client_conn` errors are confirmed as the immediate failure.
- **16:26:51:** We restart the PgBouncer instances. The pools refill, because the blocking transactions are still running.
- **16:31:53:** We confirm sessions blocked on locks, including the long-running account and user deletion queries.
- **16:39:** We cancel nine user deletions and the original account deletion.
- **16:42:** Lock counts clear and services begin recovering.
- **16:51:** First period of impact assessed as recovered.
- **17:45–17:50:** Lock contention and long-running queries return. Waiting clients and query times climb again.
- **17:54:21:** The Vercel Marketplace deletion kill switch merges and begins rolling out.
- **18:00–18:05:** Both poolers saturate a second time, at 6,102 client connections with 5,971 waiting and query times of 20 to 22 seconds.
- **~18:12:** Recovery. Lock counts had returned to baseline by 18:00; the pooler queue finished draining by 18:15.
- **18:51:** A PgBouncer configuration change merges, after recovery.

## Root Cause

The incident was caused by hard-deleting an account through a cascading foreign key graph while serving live production traffic, and then retrying that deletion while the first attempt was still holding locks.

Four factors combined:

1. **The deletion is unbounded in scope.** A single account hard delete cascades across dozens of tables in one transaction. The work done and the locks taken scale with how much data the account has, and neither is capped or checkpointed.
2. **Retries amplified it instead of being absorbed.** Eleven attempts targeted the same account. Because the work is not idempotent at the transaction level and there is no serialization in front of it, each retry queued behind its predecessor and extended the blocking window rather than replacing it.
3. **Blocked queries consume pool capacity.** A query waiting on a lock holds its PgBouncer client slot for the full wait. Lock contention on a handful of tables was therefore converted into total connection exhaustion for every service sharing the pool.
4. **The pooler does not recover with the database.** In the second event, the database returned to baseline roughly ten minutes before the platform did. Saturation of the pooler is a separate state that has to drain on its own, which means our recovery time is bounded by the pooler rather than by the underlying fault.

The third and fourth factors are what made this a platform-wide event with a long tail, rather than a slow background job. A shared connection pool with no isolation between workloads means one expensive write path can deny database access to everything else, and keep denying it after the original problem is gone.

We have not yet established who initiated the original deletion or why the first cascade ran as long as it did. We are continuing to investigate both, and will update this report as we learn more.

## What We're Doing Now

- **Gating marketplace deletions.** We have shipped an operational kill switch that stops Vercel Marketplace installation and resource deletion mutations. Deletion requests are still recorded as internal events with deterministic IDs so nothing is lost and they can be reconciled later, and the webhook returns an error so Vercel retries rather than dropping the request.
- **Moving marketplace deprovisioning to soft deletion.** We are changing the marketplace path to follow the soft deletion principle we use everywhere else, retiring only the small number of unique records that would otherwise block a reinstall, rather than hard deleting the account and cascading through its data. This removes the expensive transaction entirely while preserving the reinstall behavior that motivated hard deletion in the first place.
- **Making any remaining hard deletion incremental and serialized.** Where a hard delete is genuinely required, we are moving it out of the request path into batched, rate-limited work, with deduplication so that repeated requests for the same account cannot stack.
- **Rolling out changes into a quiet system.** The kill switch landed while the database was already contending, which gave us no clean signal about whether it had taken effect. We are tightening how we sequence mitigations during an incident so that a fix and a recurrence cannot overlap the way they did here.
- **Adding headroom and isolation at the pooler.** We have adjusted PgBouncer configuration and are reviewing pool sizing so that a single saturating workload cannot consume the connection capacity that unrelated services depend on. We are also looking at how to drain a saturated pool deliberately rather than waiting for it to clear.
- **Improving visibility into database contention.** We are expanding our PgBouncer and Postgres dashboards and alerting so that rising lock counts and client wait times page us before the pool is exhausted, rather than after dependent services begin failing.
- **Fixing recovery friction.** The missing runtime directory encountered during the PgBouncer restart, and the SSH access gaps that slowed responders from reaching the pooler hosts, are both being addressed so that operating this tier during an incident is faster.

## What This Means For You

- Run scheduling and event acknowledgement were interrupted in two windows: approximately 16:18 to 16:42, and 17:50 to 18:12.
- Events sent during the incident were durably accepted; delivery and scheduling resumed as connections recovered.
- Runs scheduled during these windows were delayed while queued work caught up.

We apologize for the disruption. An internal administrative operation should never be able to interrupt function execution for unrelated customers, and the changes above are aimed squarely at that separation.

If you have questions about this incident or need help with affected runs, please contact [our support team](https://support.inngest.com).
