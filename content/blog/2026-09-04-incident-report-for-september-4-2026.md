---
focus: false
featured: false
heading: "Incident report for September 4, 2026 - Network connectivity issues"
subtitle: A report on the network connectivity incident that temporarily disrupted Inngest services.
image: /assets/blog/incident-post-mortem.svg
date: 2026-09-04
author:
  - Justice O.
  - Muzammil A.
  - Dan Lambright
category: engineering
---

_All timestamps are in UTC._

## Summary

On September 4, 2026, Inngest experienced a network connectivity incident that temporarily interrupted function execution across the platform. From 18:13 to 18:48 UTC, our execution services could not reach a critical state service hosted in AWS.

Events continued to be accepted during the incident, and processing resumed as services recovered. Some affected work may require replay.

## What Happened

As part of ongoing work to expand capacity across multiple data centers, we made a change to private network connectivity to establish a connection to our new data center.

[AWS permits only one Virtual Private Gateway to be attached to a VPC at a time](https://docs.aws.amazon.com/vpn/latest/s2svpn/vpn-limits.html). The existing gateway appeared to serve only an inactive tunnel, so it was removed to make room for the new connection. It was later found that the same gateway also carried the active Direct Connect association used by our existing data center to reach AWS-hosted services. Removing it temporarily interrupted that path.

Several critical execution services depend on that private path to reach the AWS-hosted state required to schedule and run functions. When the path became unavailable, those services could not initialize or make progress. This interrupted function execution and delayed scheduling across the platform.

Within minutes of identifying the impact, we restored the original VPC attachment. As [AWS documents](https://docs.aws.amazon.com/directconnect/latest/UserGuide/virtualgateways.html), detaching a Virtual Private Gateway from a VPC also disassociates it from a Direct Connect gateway. Reattaching the VPC attachment did not automatically restore that separate Direct Connect association, so the team had to identify and restore it before traffic and dependent services could recover.

The affected path did not have enough independent redundancy. While our services have connection fallbacks, they depended on the same unavailable network path and could not keep execution available in a degraded state.

## Timeline

- **18:13:** Function execution becomes unavailable across the platform.
- **18:17:** We declare an incident and begin investigating.
- **18:26:** We publish a status-page update and begin customer communication.
- **18:48:** Connectivity is restored and services begin recovering.
- **19:09:** We move the public status-page incident to Monitoring while we verify recovery and process queued work.

## Root Cause

The incident was caused by an interruption to the private network path between our existing data center and AWS-hosted state services. Detaching the Virtual Private Gateway from the VPC also disassociated its Direct Connect gateway association. Restoring the VPC attachment alone did not automatically restore that Direct Connect association. Without connectivity, the services responsible for state, scheduling, and execution could not operate normally, which led to a platform-wide function execution outage.

The design also exposed a single network failure domain: the loss of one connectivity path could interrupt execution rather than allowing the platform to continue in a degraded mode.

## What We’re Doing Now

We restored the affected connection and monitored service recovery. Bringing new capacity online and building high availability are separate initiatives: the former adds capacity, while the latter requires redundant network paths and failover.

- **Completing connectivity to the new data center.** We are finishing the remaining network work required to bring new capacity online.
- **Strengthening critical network change controls.** We are improving the planning, validation, and review of changes to critical connectivity.
- **Building redundancy for critical connectivity.** We are prioritizing redundant network paths and failover for execution dependencies. We will share a more detailed update as the design and implementation plan are finalized.

## What This Means For You

- Function execution was unavailable from 18:13 to 18:48 UTC.
- Some affected work may require replay.
- Function scheduling resumed after connectivity was restored and queued work began catching up.

We apologize for the disruption. We know customers depend on Inngest, and we believe it’s important to share what happened. We’re continuing to build out capacity across multiple data centers and make sure a failure in one network path doesn’t interrupt execution.

If you have questions about this incident or need help with affected runs, please contact [our support team](https://support.inngest.com).
