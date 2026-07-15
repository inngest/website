---
focus: false
featured: false
heading: "Root Cause Analysis: Service Incident on July 10, 2026"
subtitle: A root cause analysis of the incident on July 10, 2026 that degraded function execution and run scheduling.
date: 2026-07-15
author: Bruno Scheufler
category: engineering
---

_All timestamps are in UTC._

## Summary

On July 10, 2026, a disruption at one of our third-party infrastructure providers caused our feature-flag system to stop returning live values. As a result, a release deployed that day fell back to default configuration values across several of our services.

These fallback values changed how our internal services routed traffic and scheduled work, which in turn degraded our internal network and disrupted function execution and run scheduling. Separately, a code regression in the same release caused a subset of retried requests to fail. We rolled back the release, which coincided with the third-party provider restoring service, and the majority of impact was resolved.

Function execution was degraded for 60 minutes (16:45–17:45 UTC) and run scheduling for 125 minutes (16:10–18:15 UTC).

## What Happened

Connectivity to the third-party service that supplies our feature-flag values degraded. Our services were unable to fetch flag values, both on startup and via streaming updates, so all affected feature flags reverted to their default states.

When we rolled out a new release that day, newly started containers were unable to retrieve feature-flag values and fell back to default configuration. Two consequences followed:

- A subset of internal traffic switched from its optimized transport path to a legacy path, which overloaded our internal network. Between 16:45 and 17:47 UTC, network performance was severely degraded: DNS query volume increased roughly tenfold, DNS lookup latency spiked, and connection setup times rose sharply. Traffic on a key internal path effectively stalled, breaking function execution.
- Another subsystem was configured incorrectly, leading to retries in run scheduling for a subset of customers using debounce.

In parallel, the same release contained a regression affecting certain idempotent requests on the scheduling path. During retries, this caused a subset of events to repeatedly fail until the release was rolled back.

### Customer-facing impact

- Function execution was delayed due to impaired internal connectivity. A subset of steps may have failed between 16:45 and 17:45 UTC. These should have retried, except for function runs with disabled or exhausted retries.
- Run scheduling was delayed due to the scheduling errors and the request regression on retries.
- Some outbound step requests (`step.fetch()`) returned empty responses, which may have disrupted dependent application logic.
- Some customers may need to replay affected events to ensure the associated functions execute as expected.

## Timeline (UTC, July 10, 2026)

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

### Duration of impact

- **Function execution:** ~60 minutes (16:45–17:45 UTC).
- **Run scheduling:** ~125 minutes (16:10–18:15 UTC).

## Root Cause

The primary cause was the loss of connectivity to a third-party feature-flag service. When flag values could not be fetched, our services fell back to default configuration. Two of those defaults had significant downstream effects: one rerouted internal traffic onto a legacy transport that overloaded our network, and one triggered a configuration migration that sent scheduling work to the wrong location.

A contributing factor was a code regression in the same release that caused a subset of idempotent scheduling requests to fail during retries, independent of the feature-flag issue.

## Follow-Ups

### Already completed

- Switched a subset of feature flags to static values, removing the dependency on the third-party provider for those critical paths.
- Added instrumentation for feature-flag related issues to detect this class of failure faster.

### Scheduled and in progress

- **Expand networking alerts.** Add alerting for CPU and network throughput on the internal network, elevated connection-reset rates, resource-pool saturation, and the internal network-translation layer, so rapid changes in traffic and connectivity are caught earlier.
- **Improve observability.** Improve run-scheduling observability to detect events that did not produce runs, implement event auditing (including when an event was intentionally debounced or rate-limited).
- **Improve resilience of internal tooling and configuration.** Reduce the blast radius of the internal network-translation layer, harden deployment tooling so rollbacks are not delayed during incidents, and complete planned upgrades of the internal gateway infrastructure.

## What This Means For You

If your functions rely on events sent during the impact window (approximately 16:10–18:15 UTC on July 10, 2026), some events may not have scheduled runs, and some steps may have received empty responses. We recommend reviewing activity during this window and replaying affected events where needed. If you would like help identifying or replaying impacted events, please reach out to [our support team](https://support.inngest.com).
