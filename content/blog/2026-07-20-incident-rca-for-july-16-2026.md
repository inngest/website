---
focus: false
featured: false
heading: "Root Cause Analysis: Service Incident on July 16, 2026"
subtitle: A root cause analysis of the incident on July 16, 2026 that caused increased execution latency and checkpointing errors.
date: 2026-07-20
author: Muzammil A.
category: engineering
---

_All timestamps are in UTC._

## Summary

On July 16, 2026, Inngest experienced an incident that caused increased execution latency and elevated errors for customers.

The issue occurred while we were preparing our state store infrastructure for upcoming upgrades. As part of that work, we had enabled an upgrade-readiness state store path behind a feature flag. That path depended on an internal state store connection during startup. While the path was covered by monitoring, it was tied to a medium-priority alert and a lower SLO than was appropriate for the customer impact this failure mode could create.

When that dependency began timing out, newly restarted state store proxy instances were unable to become ready. As more instances restarted, available proxy capacity dropped until the checkpointing API could no longer serve traffic reliably. We resolved the incident by disabling the upgrade-readiness state store path and restarting the affected proxy instances.

## What Happened

The checkpointing API depends on the state store proxy layer to persist intermediate function progress. During upgrade preparation, an upgrade-readiness path in that proxy layer was enabled for testing. We had tested this path extensively, including proxy restarts and several state store connection failure scenarios. The path was intended to validate readiness for future state store upgrades, but it introduced an availability dependency during proxy startup.

The system initially appeared healthy: existing proxy connections continued serving traffic, and the brief background errors we observed recovered quickly. The failure mode appeared later, as state store proxy instances were evicted and restarted over time. When those instances restarted, they had to establish fresh state store connections during startup. Those startup attempts timed out, and the instances were unable to become ready before being restarted again.

This did not affect traffic immediately, but over time the available proxy capacity degraded as instances restarted and failed to rejoin service. Once capacity dropped far enough, checkpointing requests from API services and some executors began failing.

For functions using checkpointing, SDKs were unable to persist intermediate step progress through the checkpointing API. When checkpoint writes failed, SDKs fell back to returning completed step results through the normal async response path. This fallback is designed to preserve completed step output where possible, but it is less efficient and more sensitive to retries than the checkpointed path.

### Customer-facing impact

- Customers experienced increased execution latency and elevated execution errors.
- Checkpointing requests failed for affected functions during the incident window.
- SDKs fell back to the normal async response path when checkpoint writes failed, which increased retries and latency.
- Some functions, signals, or execution progress may have been delayed or failed during the incident window.

## Timeline (UTC, July 16, 2026)

| Time  | Event                                                                                         |
| ----- | --------------------------------------------------------------------------------------------- |
| 07:11 | An upgrade-readiness state store path was enabled.                                            |
| 09:32 | State store proxy instances were evicted and rescheduled, then failed to become ready.         |
| 09:35 | A medium-priority alert fired for the affected state store path.                              |
| 11:40 | Incident formally identified and response initiated.                                          |
| 12:10 | Fix deployed by disabling the upgrade-readiness state store path and restarting proxies.       |
| 12:20 | Incident resolved; checkpointing throughput and error rates confirmed back to normal.          |

### Duration of impact

- **Checkpointing API and execution latency:** 2 hours 50 minutes.

## Root Cause

The primary cause was a startup dependency in an upgrade-readiness state store path. When an internal state store connection began timing out, newly restarted state store proxy instances waited on that dependency before becoming ready. As a result, those instances could not serve traffic, and checkpointing API availability degraded as proxies restarted over time.

A contributing factor was that the upgrade-readiness path was monitored with medium-priority alerting and a lower SLO than was appropriate for its customer impact. The alerting did not reflect that this path could affect the checkpointing API when proxy instances restarted.

Another contributing factor was that our prior testing had covered proxy restarts and several connection-failure scenarios, but had not covered this specific timeout-at-startup behavior in the upgrade path. The system handled already-established connections as expected, but newly started proxy instances treated the timeout as a startup-blocking failure instead of continuing to serve traffic on the stable state store path.

## Additional Safeguards

We have completed the immediate mitigation by disabling the upgrade-readiness state store path and restarting the affected proxy instances. Checkpointing throughput and error rates returned to normal after traffic moved back to the stable state store path.

We have also added safeguards before continuing this upgrade work:

- Removed the startup dependency that allowed one unhealthy state store path to prevent proxy instances from serving traffic.
- Moved monitoring for checkpointing API errors, proxy retry rates, and upgrade-readiness state store paths to higher-priority alerts with SLOs that better reflect customer impact.
- Added coverage for checkpointing API failures so customer-impacting errors are detected more directly.
- Added timeout-at-startup coverage to our upgrade validation so proxy restarts are tested against the same failure mode that occurred here.

## What This Means For You

If your functions used checkpointing during the incident window beginning around 09:32 UTC on July 16, 2026, you may have seen delayed execution progress, failed checkpoint requests, additional retries, or function and signal-related failures.

If you would like help reviewing impact to your workloads during this window, please reach out to [our support team](https://support.inngest.com).
