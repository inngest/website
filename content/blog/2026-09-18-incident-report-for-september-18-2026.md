---
focus: false
featured: false
heading: "Incident report for September 18, 2026 - When Deletion Cascades Exhausted Our Database Connections"
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

On September 18, 2026, an account deletion originating from our Vercel Marketplace integration blocked our primary Postgres database for long enough to exhaust PgBouncer, the connection pooler that sits in front of it. From 16:18 to 16:42 UTC, both PgBouncer instances were rejecting new connections, and services across the platform could not reach the database. This stalled run scheduling and event acknowledgement. A second, slightly larger period of impact ran from 17:50 to 18:12 UTC, while we were rolling out the mitigation.

Events sent to Inngest during the incident were durably accepted, and scheduling resumed once the blocking transactions cleared. Affected work was delayed rather than lost.

## What Happened

We use Postgres for account management: accounts, workspaces, API keys and the rest of our customer-facing configuration. Our services query it continuously, not occasionally — resolving entitlements and tier changes, determining which part of our infrastructure an account's work should run on, and picking up configuration changes as they happen. They reach it through PgBouncer, a connection pooler that multiplexes many application connections onto a smaller number of real database connections, and every service draws from the same shared pools.

At 15:39:39, our Vercel Marketplace integration received an installation deletion and began deprovisioning the corresponding Inngest account. That path was built to hard delete, rather than to soft delete the way we do everywhere else, so that an uninstalled account leaves nothing behind that would block the customer from installing again later. It deletes the user inside a transaction, then issues a real `DELETE` against the account row. That second statement cascades: accounts and workspaces are referenced by foreign keys from dozens of tables, most declared `ON DELETE CASCADE`. One account deletion fans out across a large portion of the schema in a single transaction, holding locks on everything it touches until it commits.

What turned a slow transaction into an outage was the retry behavior around it. Between 15:41 and 15:56, ten more deletion attempts arrived for the same installation and account. Each tried to delete rows the first transaction already held locks on, so instead of failing fast they queued behind it — one user-delete query ended up waiting 44 minutes. Lock counts on the primary peaked at roughly seventeen times baseline at 16:16.

Blocked queries do not release their connection, so each one held a client slot in PgBouncer for the entire wait. Client connections rose to roughly fourteen times their steady-state level, almost all of them doing nothing but waiting. By 16:18–16:19 PgBouncer was full, rejecting new connections and disconnecting waiting clients at the 120 second timeout:

```
FATAL: no more connections allowed (max_client_conn) (SQLSTATE 08P01)
```

At that point the failure was platform-wide, including services with no relationship to the deletion. Run scheduling volume dropped, inbound events stopped being acknowledged, Connect gateway and Constraint API throughput fell, checkpointing latency breached its SLO, and several services crash-looped because they could not reach the database on startup.

We restarted PgBouncer at 16:26. The blocking transactions were still running, so the pools simply refilled, and the restart surfaced an unrelated missing runtime directory that slowed us further. The first period of impact ended instead at 16:39, when we cancelled nine of the user deletions along with the original account deletion. Lock counts cleared by approximately 16:42.

### The recurrence during rollout

Cancelling the queries removed the symptom but not the source: deletion requests were still arriving and still being processed. So we prepared a kill switch to stop the deletion path outright.

At 17:45 the same pattern began again. The kill switch merged at 17:54:21, rolling out into a system that was already contending, and by 18:00 PgBouncer was saturated a second time — marginally worse than the first peak, with average query times of 20 to 22 seconds. The second wave hit more services than the first: executor, batches, pauses, new-runs, queue-proxy, debug-api and CDC crash-looped, two queue shards stopped processing, and a batches backlog built up. Twelve separate incidents were merged into this one during the first wave, and a further twelve during the second.

Recovery came at approximately 18:12. Postgres lock counts had already returned to baseline by 18:00, while PgBouncer stayed saturated for another eight to ten minutes — a gap we return to below. By 18:15 waiting clients were at zero and query times were back to 15–16 ms.

## Timeline

- **15:39:39:** A Vercel Marketplace installation deletion begins. The user is deleted inside a transaction, and the cascading account delete starts.
- **15:41–15:56:** Ten further deletion attempts arrive for the same installation and account. They queue behind the first transaction; one waits 44 minutes.
- **16:09:** PgBouncer client queues begin growing.
- **16:16:** Database lock counts peak at roughly seventeen times baseline.
- **16:18–16:19:** Our PgBouncer instances fill and begin rejecting connections and disconnecting clients at the 120 second wait timeout.
- **16:21:44:** We declare an incident and page on-call.
- **16:22:47:** `max_client_conn` errors are confirmed as the immediate failure.
- **16:26:51:** We restart the PgBouncer instances. The pools refill, because the blocking transactions are still running.
- **16:31:53:** We confirm sessions blocked on locks, including the long-running account and user deletion queries.
- **16:39:** We cancel nine user deletions and the original account deletion.
- **16:42:** Lock counts clear and services begin recovering.
- **16:51:** First period of impact assessed as recovered.
- **17:45–17:50:** Lock contention and long-running queries return. Waiting clients and query times climb again.
- **17:54:21:** The Vercel Marketplace deletion kill switch merges and begins rolling out.
- **18:00–18:05:** PgBouncer saturates a second time, marginally worse than the first peak, with query times of 20 to 22 seconds.
- **~18:12:** Recovery. Lock counts had returned to baseline by 18:00; the PgBouncer queue finished draining by 18:15.

## Root Cause

The incident was caused by hard-deleting an account through a cascading foreign key graph while serving live production traffic, and then retrying that deletion while the first attempt was still holding locks.

Four factors combined:

1. **The deletion is unbounded in scope.** A single account hard delete cascades across dozens of tables in one transaction. The work done and the locks taken scale with how much data the account has, and neither is capped or checkpointed.
2. **Retries amplified it instead of being absorbed.** Eleven attempts targeted the same account. Because the work is not idempotent at the transaction level and there is no serialization in front of it, each retry queued behind its predecessor and extended the blocking window rather than replacing it.
3. **Blocked queries consume pool capacity.** A query waiting on a lock holds its PgBouncer client slot for the full wait. Lock contention on a handful of tables was therefore converted into total connection exhaustion for every service sharing the pool.
4. **PgBouncer does not recover with the database.** In the second event, the database returned to baseline roughly ten minutes before the platform did. PgBouncer saturation is a separate state that has to drain on its own, which means our recovery time is bounded by PgBouncer rather than by the underlying fault.

The third and fourth factors are what made this a platform-wide event with a long tail, rather than a slow background job. A shared connection pool with no isolation between workloads means one expensive write path can deny database access to everything else, and keep denying it after the original problem is gone.

We have not yet established who initiated the original deletion or why the first cascade ran as long as it did. We are continuing to investigate both, and will update this report as we learn more.

## What We're Doing Now

- **Gating marketplace deletions.** We have shipped an operational kill switch that stops Vercel Marketplace installation and resource deletion mutations. Deletion requests are still recorded as internal events with deterministic IDs so nothing is lost and they can be reconciled later, and the webhook returns an error so Vercel retries rather than dropping the request.
- **Moving marketplace deprovisioning to soft deletion.** We are changing the marketplace path to follow the soft deletion principle we use everywhere else, retiring only the small number of unique records that would otherwise block a reinstall, rather than hard deleting the account and cascading through its data. This removes the expensive transaction entirely while preserving the reinstall behavior that motivated hard deletion in the first place.
- **Making any remaining hard deletion incremental and serialized.** Where a hard delete is genuinely required, we are moving it out of the request path into batched, rate-limited work, with deduplication so that repeated requests for the same account cannot stack.
- **Rolling out changes into a quiet system.** The kill switch landed while the database was already contending, which gave us no clean signal about whether it had taken effect. We are tightening how we sequence mitigations during an incident so that a fix and a recurrence cannot overlap the way they did here.
- **Adding headroom and isolation in PgBouncer.** We have adjusted PgBouncer configuration and are reviewing pool sizing so that a single saturating workload cannot consume the connection capacity that unrelated services depend on. We are also looking at how to drain a saturated pool deliberately rather than waiting for it to clear.
- **Improving visibility into database contention.** We are expanding our PgBouncer and Postgres dashboards and alerting so that rising lock counts and client wait times page us before the pool is exhausted, rather than after dependent services begin failing.
- **Fixing recovery friction.** The missing runtime directory encountered during the PgBouncer restart, and the SSH access gaps that slowed responders from reaching the PgBouncer hosts, are both being addressed so that operating this tier during an incident is faster.

## What This Means For You

- Run scheduling and event acknowledgement were interrupted in two windows: approximately 16:18 to 16:42, and 17:50 to 18:12.
- Events sent during the incident were durably accepted; delivery and scheduling resumed as connections recovered.
- Runs scheduled during these windows were delayed while queued work caught up.

We apologize for the disruption. An internal administrative operation should never be able to interrupt function execution for unrelated customers, and the changes above are aimed squarely at that separation.

If you have questions about this incident or need help with affected runs, please contact [our support team](https://support.inngest.com).
