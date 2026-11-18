---
focus: false
featured: false
heading: "Incident report for November 12, 2026 - Missed function runs"
subtitle: A report on a scheduling edge case that prevented some events from starting their expected function runs.
image: /assets/blog/incident-post-mortem.svg
date: 2026-11-17
author:
  - Inngest
category: engineering
---

_All timestamps are in UTC._

## Summary

On November 12, 2026, from 19:25 to 19:43 UTC, a scheduling edge case prevented some events received by Inngest Cloud from starting their expected function runs. Inngest accepted and stored the events, but a queue routing failure caused retries to be incorrectly treated as duplicates. Affected events appeared in the dashboard without a corresponding run or failure record. We fixed this edge case in the November 13 release.

The issue affected a subset of customers. Scheduling requests failed only when they passed through one queue proxy instance and needed the shared queue shard missing from its routing table. Enterprise workloads on Dedicated Infrastructure use separate queue shards and were unaffected.

## What Happened

When Inngest receives an event, the Event API validates it and publishes it to an internal event stream. Our scheduling service reads that stream, finds functions whose triggers match the event, and applies their flow-control settings. When a function is ready to start, the scheduler records the initial run state and sends the first unit of work to the queue. An executor picks up that work and calls the function on your infrastructure. You can learn more about this in our documentation on [Inngest Cloud architecture](/docs/platform-and-operations/cloud-architecture-and-security?ref=blog-incident-report-for-november-12-2026#from-event-to-run).

The queue is split into shards that each handle part of the workload. An internal routing service, called queue-proxy, sends each request to the appropriate shard. During a rollout on November 12, one proxy instance timed out while looking up the network address of a shard. The instance continued serving traffic with that shard missing from its routing table. Scheduling attempts failed when they passed through that instance and needed the missing shard. Other instances continued routing work to the shard.

## Timeline

| Date and time         | Event                                                                |
| --------------------- | -------------------------------------------------------------------- |
| November 12, 19:24:58 | The affected queue proxy instance starts during a rollout.           |
| November 12, 19:25:06 | A DNS lookup for one queue shard times out during startup.           |
| November 12, 19:25:20 | The first queue routing errors are recorded.                         |
| November 12, 19:43:23 | The last queue routing error from the affected instance is recorded. |
| November 13           | We investigate reports of missing runs and roll out the fix.         |

## Root Cause

The routing failure exposed an edge case in how the scheduler retried work. After the first attempt failed to enqueue the run, the scheduler cleared the run state and left a marker used to prevent duplicate execution. When the event was delivered again, the scheduler read that marker as evidence the run had already been handled and skipped the retry. The original event remained visible, but the function never started and no failure record appeared.

## Corrective Actions

We merged and rolled out changes on November 13 that prevent an unavailable queue shard from causing function run scheduling to fail in this edge case. We also improved internal monitoring for queue routing failures so we can detect this type of issue sooner.

## What This Means For You

If you sent events during the affected window and an expected run is still missing, those events may require replay. Our support team can help you check which events were affected and determine whether replay is needed.

We apologize for any inconvenience caused.
