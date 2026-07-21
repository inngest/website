---
focus: false
featured: false
heading: "Root Cause Analysis: Service Incidents on July 10 and July 16, 2026"
subtitle: A combined root cause analysis of the incidents in July 2026 that affected function execution, run scheduling, checkpointing, and execution metrics.
date: 2026-07-22
author:
  - Bruno Scheufler
  - Muzammil A.
  - Dan Lambright
category: engineering
---

_All timestamps are in UTC._

In July 2026, Inngest experienced three incidents: one on July 10 that degraded function execution and run scheduling, and two on July 16 — one that caused increased execution latency and checkpointing errors, and one that disrupted publishing of customer execution metrics.

We know our customers depend on Inngest as critical infrastructure, and we apologize for the disruption these incidents caused. This report covers what happened in each incident, the root causes, and the corrective actions we have taken and are still working on.

## Incident 1 — July 10: Degraded function execution and run scheduling

### Summary

On July 10, 2026, a disruption at one of our third-party infrastructure providers caused our feature-flag system to stop returning live values. As a result, a release deployed that day fell back to default configuration values across several of our services.

These fallback values changed how our internal services routed traffic and scheduled work, which in turn degraded our internal network and disrupted function execution and run scheduling. Separately, a code regression in the same release caused a subset of retried requests to fail. We rolled back the release, which coincided with the third-party provider restoring service, and the majority of impact was resolved.

Function execution was degraded for 60 minutes (16:45–17:45 UTC) and run scheduling for 125 minutes (16:10–18:15 UTC).

### What happened

Connectivity to the third-party service that supplies our feature-flag values degraded. Our services were unable to fetch flag values, both on startup and via streaming updates, so all affected feature flags reverted to their default states.

When we rolled out a new release that day, newly started containers were unable to retrieve feature-flag values and fell back to default configuration. Two consequences followed:

- A subset of internal traffic switched from its optimized transport path to a legacy path, which overloaded our internal network. Between 16:45 and 17:47 UTC, network performance was severely degraded: DNS query volume increased roughly tenfold, DNS lookup latency spiked, and connection setup times rose sharply. Traffic on a key internal path effectively stalled, breaking function execution.
- Another subsystem was configured incorrectly, leading to retries in run scheduling for a subset of customers using debounce.

In parallel, the same release contained a regression affecting certain idempotent requests on the scheduling path. During retries, this caused a subset of events to repeatedly fail until the release was rolled back.

Customer-facing impact:

- Function execution was delayed due to impaired internal connectivity. A subset of steps may have failed between 16:45 and 17:45 UTC. These should have retried, except for function runs with disabled or exhausted retries.
- Run scheduling was delayed due to the scheduling errors and the request regression on retries.
- Some outbound step requests (`step.fetch()`) returned empty responses, which may have disrupted dependent application logic.
- Some customers may need to replay affected events to ensure the associated functions execute as expected.

### Timeline (UTC, July 10, 2026)

| Time  | Event                                                                                                                  |
| ----- | ---------------------------------------------------------------------------------------------------------------------- |
| 16:11 | Customer impact began. A subset of events began failing on retry due to the request regression on the scheduling path. |
| 16:19 | First feature-flag initialization errors observed as containers failed to fetch flag values.                           |
| 16:20 | Scheduling errors and retries started for a subset of customers.                                                       |
| 16:45 | Internal network performance began degrading severely as traffic shifted to the legacy path.                           |
| 17:40 | Release rolled back. Retries on the affected request path stopped failing.                                             |
| 17:41 | Internal gateway metrics began returning toward normal.                                                                |
| 17:45 | Function execution impact ended.                                                                                       |
| 17:47 | Internal network performance recovered.                                                                                |
| 17:57 | Rollback fully propagated; status moved to Monitoring (Severity upgraded to Critical).                                 |
| 18:04 | Last feature-flag initialization errors observed.                                                                      |
| 18:15 | Scheduling returned to normal; run-scheduling impact ended.                                                            |
| 18:44 | Incident resolved; throughput confirmed back to normal.                                                                |

Duration of impact:

- **Function execution:** ~60 minutes (16:45–17:45 UTC).
- **Run scheduling:** ~125 minutes (16:10–18:15 UTC).

### Root cause

The primary cause was the loss of connectivity to a third-party feature-flag service. When flag values could not be fetched, our services fell back to default configuration. Two of those defaults had significant downstream effects: one rerouted internal traffic onto a legacy transport that overloaded our network, and one triggered a configuration migration that sent scheduling work to the wrong location.

A contributing factor was a code regression in the same release that caused a subset of idempotent scheduling requests to fail during retries, independent of the feature-flag issue.

### Follow-ups

Already completed:

- Switched a subset of feature flags to static values, removing the dependency on the third-party provider for those critical paths.
- Added instrumentation for feature-flag related issues to detect this class of failure faster.

Scheduled and in progress:

- **Expand networking alerts.** Add alerting for CPU and network throughput on the internal network, elevated connection-reset rates, resource-pool saturation, and the internal network-translation layer, so rapid changes in traffic and connectivity are caught earlier.
- **Improve observability.** Improve run-scheduling observability to detect events that did not produce runs, implement event auditing (including when an event was intentionally debounced or rate-limited).
- **Improve resilience of internal tooling and configuration.** Reduce the blast radius of the internal network-translation layer, harden deployment tooling so rollbacks are not delayed during incidents, and complete planned upgrades of the internal gateway infrastructure.

## Incident 2 — July 16: Increased execution latency and checkpointing errors

### Summary

On July 16, 2026, Inngest experienced an incident that caused increased execution latency and elevated errors for customers.

The issue occurred while we were preparing our state store infrastructure for upcoming upgrades. As part of that work, we had enabled an upgrade-readiness state store path behind a feature flag. That path depended on an internal state store connection during startup. While the path was covered by monitoring, it was tied to a medium-priority alert and a lower SLO than was appropriate for the customer impact this failure mode could create.

When that dependency began timing out, newly restarted state store proxy instances were unable to become ready. As more instances restarted, available proxy capacity dropped until the checkpointing API could no longer serve traffic reliably. We resolved the incident by disabling the upgrade-readiness state store path and restarting the affected proxy instances.

### What happened

The checkpointing API depends on the state store proxy layer to persist intermediate function progress. During upgrade preparation, an upgrade-readiness path in that proxy layer was enabled for testing. We had tested this path extensively, including proxy restarts and several state store connection failure scenarios. The path was intended to validate readiness for future state store upgrades, but it introduced an availability dependency during proxy startup.

The system initially appeared healthy: existing proxy connections continued serving traffic, and the brief background errors we observed recovered quickly. The failure mode appeared later, as state store proxy instances were evicted and restarted over time. When those instances restarted, they had to establish fresh state store connections during startup. Those startup attempts timed out, and the instances were unable to become ready before being restarted again.

This did not affect traffic immediately, but over time the available proxy capacity degraded as instances restarted and failed to rejoin service. Once capacity dropped far enough, checkpointing requests from API services and some executors began failing.

For functions using checkpointing, SDKs were unable to persist intermediate step progress through the checkpointing API. When checkpoint writes failed, SDKs fell back to returning completed step results through the normal async response path. This fallback is designed to preserve completed step output where possible, but it is less efficient and more sensitive to retries than the checkpointed path.

Customer-facing impact:

- Customers experienced increased execution latency and elevated execution errors.
- Checkpointing requests failed for affected functions during the incident window.
- SDKs fell back to the normal async response path when checkpoint writes failed, which increased retries and latency.
- Some functions, signals, or execution progress may have been delayed or failed during the incident window.

### Timeline (UTC, July 16, 2026)

| Time  | Event                                                                                    |
| ----- | ---------------------------------------------------------------------------------------- |
| 07:11 | An upgrade-readiness state store path was enabled.                                       |
| 09:32 | State store proxy instances were evicted and rescheduled, then failed to become ready.   |
| 09:35 | A medium-priority alert fired for the affected state store path.                         |
| 11:40 | Incident formally identified and response initiated.                                     |
| 12:10 | Fix deployed by disabling the upgrade-readiness state store path and restarting proxies. |
| 12:20 | Incident resolved; checkpointing throughput and error rates confirmed back to normal.    |

Duration of impact:

- **Checkpointing API and execution latency:** 2 hours 50 minutes.

### Root cause

The primary cause was a startup dependency in an upgrade-readiness state store path. When an internal state store connection began timing out, newly restarted state store proxy instances waited on that dependency before becoming ready. As a result, those instances could not serve traffic, and checkpointing API availability degraded as proxies restarted over time.

A contributing factor was that the upgrade-readiness path was monitored with medium-priority alerting and a lower SLO than was appropriate for its customer impact. The alerting did not reflect that this path could affect the checkpointing API when proxy instances restarted.

Another contributing factor was that our prior testing had covered proxy restarts and several connection-failure scenarios, but had not covered this specific timeout-at-startup behavior in the upgrade path. The system handled already-established connections as expected, but newly started proxy instances treated the timeout as a startup-blocking failure instead of continuing to serve traffic on the stable state store path.

### Follow-ups

We have completed the immediate mitigation by disabling the upgrade-readiness state store path and restarting the affected proxy instances. Checkpointing throughput and error rates returned to normal after traffic moved back to the stable state store path.

We have also added safeguards before continuing this upgrade work:

- Removed the startup dependency that allowed one unhealthy state store path to prevent proxy instances from serving traffic.
- Moved monitoring for checkpointing API errors, proxy retry rates, and upgrade-readiness state store paths to higher-priority alerts with SLOs that better reflect customer impact.
- Added coverage for checkpointing API failures so customer-impacting errors are detected more directly.
- Added timeout-at-startup coverage to our upgrade validation so proxy restarts are tested against the same failure mode that occurred here.

## Incident 3 — July 16: Delayed execution metrics

### Summary

On July 16, 2026, starting at approximately 15:45 UTC, publishing of customer execution metrics to our metrics pipeline began to fail. During the incident window, dashboards showed no function execution or throughput metrics for affected customers. Function execution itself was not affected.

The underlying issue was configuration drift between our live infrastructure and our infrastructure-as-code definitions. The metrics publishing path had been introduced earlier this year, and the associated message-broker topic and access permissions had been applied manually to the live cluster without being fully codified in our infrastructure repository. During routine maintenance on the cluster, resources were reapplied from the codified definitions, which unintentionally removed the manually applied permissions. Metrics publishing began failing with authorization errors immediately afterward.

We restored the missing permissions, codified the topic and access definitions in our infrastructure repository, and restarted the affected services. Publishing recovered and error volume dropped to zero.

### What happened

Customer execution metrics are published through a message broker before being ingested into our analytics store. The topic and access permissions for this path existed in the live production cluster but were not fully declared in our infrastructure-as-code repository — the cluster was relying on live-only state.

During maintenance and scaling operations, broker resources were reapplied from the codified definitions. Because those definitions omitted the metrics topic permissions, the reapply removed them, and services lost authorization to publish execution metrics. Because we had not yet set up alerting on this publishing path, the failure was not detected until later, when the incident was formally declared.

Customer-facing impact:

- Dashboards showed no function execution or throughput metrics during the incident window.
- Execution metrics generated during the window were dropped and will not appear in historical metrics.
- Function execution, scheduling, and run state were **not** affected — only the metrics observability path.

### Timeline (UTC, July 16, 2026)

| Time  | Event                                                                             |
| ----- | --------------------------------------------------------------------------------- |
| 15:45 | Metrics publishing errors started; customer impact began.                         |
| 17:44 | Incident declared and investigation started.                                      |
| 17:55 | Topic and access permission definitions reapplied; affected services restarted.   |
| 19:05 | Publishing confirmed fully recovered and error volume at zero; incident resolved. |

### Root cause

The primary cause was infrastructure configuration drift: the message-broker topic and access permissions for the execution metrics path were applied manually to the live production cluster without being codified in our infrastructure-as-code repository. When broker resources were later reapplied from the codified definitions during maintenance, the manually applied permissions were removed and publishing failed.

Contributing factors:

- Execution metrics had recently moved to being published through the message broker rather than written directly to the analytics store, increasing the impact of this path.
- We had not yet set up alerting or monitoring on this publishing path, which delayed detection.

### Follow-ups

- Codified the metrics topic and access permission definitions in our infrastructure repository, making infrastructure-as-code the source of truth.
- Added CI safeguards to detect drift between live broker configuration and codified definitions.
- Adding alerting on metrics publishing errors so failures on this path are detected immediately.
- Reinforced our operational policy that production changes must be codified and reviewed rather than applied manually.

## What This Means For You

- **July 10 (16:10–18:15 UTC):** If your functions rely on events sent during this window, some events may not have scheduled runs, and some steps may have received empty responses. We recommend reviewing activity during this window and replaying affected events where needed.
- **July 16 (09:32–12:20 UTC):** If your functions used checkpointing during this window, you may have seen delayed execution progress, failed checkpoint requests, additional retries, or function and signal-related failures.
- **July 16 (15:45–19:05 UTC):** Execution metrics for this window are missing from dashboards and cannot be backfilled. Function execution itself was not affected.

If you would like help reviewing impact to your workloads during any of these windows, or identifying and replaying affected events, please reach out to [our support team](https://support.inngest.com).
