---
focus: false
featured: false
heading: "Incident report for October 20, 2026 - Event ingestion and processing disruption"
subtitle: A root cause analysis of the connectivity disruption that affected event ingestion, function scheduling, execution, and checkpointing.
image: /assets/blog/incident-post-mortem.svg
date: 2026-10-23
author:
  - Bruno Scheufler
category: engineering
---

_All timestamps are in UTC._

## Summary

On October 20, 2026, Inngest experienced two periods of disruption: **13:00–13:15** and **15:20–15:35**. During these windows, event submissions could fail or time out, function scheduling was delayed, and execution and checkpoint requests could take longer than usual. Impact varied throughout each window, with periods when event ingestion was unavailable.

The incident is resolved. Event ingestion, scheduling, and execution are operating normally. **No customer action is required.**

## What Happened

A connectivity disruption between our application infrastructure and our database impaired database-dependent operations. Database requests stalled, and scheduling, execution, and checkpoint processing slowed.

During the disruption, event ingestion services exhausted their available memory and restarted. Their startup process also required a successful database connection, so they could not return to service while connectivity remained impaired. This amplified the connectivity disruption into periods when event ingestion was unavailable.

When connectivity recovered, the affected services recovered and processing resumed.

## Timeline

- **13:00–13:15:** The first period of impact affected event ingestion, function scheduling, execution, and checkpointing.
- **15:20–15:35:** The connectivity disruption recurred, causing a second period of impact to the same services.

## Root Cause

The incident resulted from a loss of database connectivity, compounded by how our services handled that dependency failure. Database access was required both to process work and to bring restarted event ingestion services back online.

The failure exposed two resilience gaps: event ingestion services exhausted memory during the disruption, and their startup dependency on the database prevented them from recovering independently. Together, these turned a connectivity interruption into a broader availability issue.

## What We're Doing Now

We have made changes to harden the system against similar incidents, reduce the impact of dependency failures, and improve service recovery during connectivity interruptions. These changes address the resilience gaps that amplified this incident.

## What This Means For You

- Event submissions could fail, time out, or take longer than usual during both windows.
- Function scheduling, including cron workloads, was delayed. Function execution and checkpoint requests could also experience increased latency.
- Event ingestion, scheduling, and execution are back to normal. **No customer action is required.**

We apologize for the disruption and its impact on your applications. We know customers depend on Inngest as critical infrastructure, and we are committed to improving its reliability.

If you have questions about this incident, please contact [our support team](https://support.inngest.com).
