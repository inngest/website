---
focus: false
featured: false
hide: true
heading: "Incident report for October 9 and 10, 2026 - Cross-data-center network and database connection failures"
subtitle: A report on two incidents that disrupted function execution, and the changes we are making to remove this class of failure.
image: /assets/blog/incident-post-mortem.svg
date: 2026-10-15
author:
  - Lakshmi Kasinathan
  - Riadh Daghmoura
  - Muzammil A.
  - Justice O.
category: engineering
---

_All timestamps are in UTC._

## Summary

On October 9 and October 10, 2026, Inngest had two separate incidents that disrupted function execution. Both stem from the same architectural dependency: we currently run across three data centers, and function execution depends on all three. A failure on any path between them can interrupt service.

- **October 9, 21:05–21:49:** One of our data center providers lost network connectivity between its data center and our other data centers, as well as outbound internet access. Function execution halted and event processing was delayed for most accounts.
- **October 10, 14:00–14:48 and 15:30–16:25:** The connection poolers in front of our primary database lost their connections to the database and could not rebuild them. Run scheduling and queue processing stalled for most accounts. The mitigation we applied caused intermittent delays, mainly to cron functions, until we addressed it at 04:17 on October 11.

During both incidents, some runs that were in progress were left in a `Running` state and did not continue on their own. See [What This Means For You](#what-this-means-for-you).

## What Happened

We run Inngest across three data centers. Different accounts are processed in different places, and the state a run needs can live in a different data center from the services executing it. Our central account and configuration database, and the connection poolers in front of it, sit with yet another provider. This lets us add capacity quickly, but it means every request can cross data-center boundaries, and each of those paths is a dependency.

### October 9: network outage at a data center provider

At 21:05, one of our data center providers lost network connectivity between its data center and our other data centers, in both directions. It also lost outbound internet access. The provider's preliminary explanation is an error during a change to its DDoS protection configuration. We are waiting for its full report.

Traffic inside that data center continued to work. Anything that needed to cross its boundary did not:

- **Accounts processed in that data center** could not reach our primary database to look up account details before processing work, so queue processing stopped. Run state could not be saved either, because the state service there could not reach its own dependencies outside the data center.
- **Accounts processed elsewhere but with run state stored in that data center** could not create, load or save run state, so their runs could not make progress.
- **Accounts with no dependency on that data center** were still affected, because their events share an event-processing pipeline with the accounts above. Continuously failing work built a large backlog in that shared pipeline, which delayed event processing and function execution. Accounts with dedicated event pipelines were not affected.

Connectivity returned at 21:49. Queue processing resumed immediately and the backlog drained. A few internal services did not recover on their own and were restarted between 22:26 and 22:38.

### October 10: database connection pool collapse

Our services reach the primary database through a pair of connection poolers (PgBouncer) that we run in AWS. On October 10, both poolers lost all of their connections to the database at 14:00, and again at 15:30, and could not rebuild them.

The collapse came from an interaction between our database driver and PgBouncer. Several frequently used lookups have short deadlines. When a lookup's deadline expired while its query was still waiting in PgBouncer for a database connection, the driver cancelled the query and closed its client connection. PgBouncer had nothing running to cancel, so it later ran the abandoned query on a database connection and then closed that connection entirely, instead of returning it to the pool. Each pooler opens new database connections one at a time. Connections were being destroyed faster than they could be replaced, so the pools collapsed to nearly zero usable connections. Thousands of clients queued behind them, and their deadlines expired too, which kept the cycle going. We reproduced this behavior in a test environment.

Both collapses started at the top and bottom of the hour, when cron-scheduled work roughly triples the query rate. At the same moments, a new set of lookups we had rolled out to all accounts before the weekend began failing in large numbers, adding to the cancellations.

With no usable database connections, run scheduling could not look up accounts and functions, and queue processing stalled for most accounts. Accounts processed in the data center that reaches the database through a different path were not affected.

Restarting the poolers did not reliably recover them. Raising the pool size did not help, because opening connections, not the pool limit, was the bottleneck. The second occurrence ended when we moved all services to connection poolers run alongside the database by our database provider, which recovered processing between 16:10 and 16:25.

That mitigation introduced a further problem. The new route reaches the database through network address translation gateways, and some connections through those gateways were silently dropped. Queries on a dropped connection hung for up to 16 minutes before failing, which intermittently stalled processing, most visibly for cron functions. We moved the affected service back to the original poolers at 04:17 on October 11, and improved the gateways' routing on October 12.

## Timeline

### October 9

- **21:05:** Connectivity between one data center and our other data centers, and its outbound internet access, is lost.
- **21:09:** Internal investigations begin.
- **21:28:** We confirm the affected data center cannot connect to our other data centers and start reaching out to our provider.
- **21:49:** Connectivity is restored. Queue processing resumes and the backlog begins draining.

### October 10

- **14:00:** Both connection poolers lose their database connections. Run scheduling and queue processing stall.
- **14:03:** Alerts fire for database errors. An incident is opened and the team begins investigating.
- **14:30–14:33:** We restart the connection poolers.
- **14:34–14:48:** Processing begins to recover.
- **15:30:** Both poolers lose their database connections again.
- **16:09–16:28:** We move all services to connection poolers run alongside the database.
- **16:10–16:25:** Processing recovers and we continue to monitor.
- **17:10:** Database error rates return to normal.

### October 11

- **03:01:** Customers report delays.
- **04:17:** We move cron scheduling back to the original connection poolers.

## Root Cause

**October 9:** A network failure at one data center provider cut that data center off from our other data centers and from the internet. Because function execution depends on all three data centers, and because some accounts are processed in one data center while their run state lives in another, losing one data center's connectivity halted execution for the accounts that depend on it. A shared event-processing pipeline then carried the impact to most other accounts.

**October 10:** Short client-side deadlines on database lookups, combined with how PgBouncer handles cancelled queries that are still waiting for a connection ([a known interaction between the pgx driver and PgBouncer](https://github.com/jackc/pgx/issues/1780)), caused the poolers to destroy their own database connections faster than they could replace them. The top-of-hour load spike and a newly rolled out set of lookups triggered the loop. Our mitigation then routed database traffic through network gateways that dropped some connections. In both incidents, these internal failures counted against functions' configured retries, and a step that failed permanently on an internal error left its run `Running` instead of marking it failed, so `onFailure` handlers and functions waiting on it with `step.invoke` were not notified.

## What We're Doing Now

**Consolidating to a single data center.** The most important change is structural. We are consolidating onto a single data center that acts as a single cell, which removes this entire class of cross-data-center failure. The migration is under way and continues over the coming weeks. Through the end of the year, the engineers working on durable execution are focused solely on this migration and on reliability, including published SLOs for every part of our platform and rolling deploys across cells. We will share updates as the migration progresses.

**Specific fixes for these incidents**, several of which have already shipped:

- **Database lookups no longer cancel queries waiting in the pooler.** A lookup's deadline now ends the caller's wait without cancelling the underlying query, which removes the trigger for the October 10 collapse on the lookups involved. We are reviewing the remaining database calls on the execution path and their timeouts.
- **Internal failures no longer leave runs `Running`.** A run whose step fails permanently because of an internal error is now marked as failed, so `onFailure` handlers and invoking functions are notified. If the run's state cannot be read at that moment, the work stays queued and resumes once the state is available again, instead of being dropped.
- **Network gateway routing has been improved.** We have improved routing in the address translation gateways and codified the changes in our infrastructure configuration.
- **Faster communication.** We have improved our incident process and added automation so that our status page is updated as soon as an internal investigation begins.

## What This Means For You

- **October 9, 21:05–21:49:** Function execution halted and event processing was delayed for most accounts.
- **October 10, 14:00–14:48 and 15:30–16:25:** Run scheduling and queue processing were delayed for most accounts.
- **October 10, 21:07 – October 11, 04:17:** Intermittent delays.
- **Runs left `Running`:** some runs that were in progress during these windows were left `Running` and will not continue on their own. You can [cancel](/docs/guides/cancel-running-functions?ref=blog-incident-report-for-october-9-and-10-2026) and [replay](/docs/platform-and-operations/replay-runs-in-bulk?ref=blog-incident-report-for-october-9-and-10-2026) them yourself; replayed runs start again from the beginning, so steps that already completed will run again. If you need assistance, please contact [our support team](https://support.inngest.com).

We apologize for the disruption. The work above is aimed at removing an entire class of cross-data-center dependencies behind both incidents.

If you have questions about this incident or need help with affected runs, please contact [our support team](https://support.inngest.com).
