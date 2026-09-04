---
focus: false
featured: false
heading: "Incident report for September 4, 2026 - Function execution outage"
subtitle: A report on the network connectivity incident that temporarily interrupted function execution across Inngest.
image: /assets/blog/incident-post-mortem.svg
date: 2026-09-04
author:
  - Justice O.
  - Muzammil A.
  - Dan Lambright
category: engineering
---

_All timestamps are in PDT._

On September 4, 2026, Inngest experienced a network connectivity incident that temporarily interrupted function execution across the platform. From 11:13 AM to 11:48 AM, our execution services could not reach a critical state service hosted in AWS.

Events continued to be accepted during the incident and queued work resumed processing after connectivity was restored. Some function runs failed during the outage and may need to be replayed.

We sincerely apologize for the disruption. We know customers rely on Inngest for timely, dependable execution, and this outage fell short of that expectation.

## What happened

As part of ongoing work to expand capacity across multiple data centers, a change to private network connectivity temporarily interrupted the path between our Ashburn environment and AWS-hosted services.

Several critical execution services depend on that private path to access state required to schedule and run functions. When the path became unavailable, those services could not initialize or make progress. This interrupted function execution and delayed scheduling across the platform.

The affected path did not have enough independent redundancy. While our services have connection fallbacks, they depended on the same unavailable network path and could not keep execution available in a degraded state.

## Customer impact

- Function execution was unavailable from 11:13 AM to 11:48 AM PDT.
- Events sent to Inngest continued to be accepted and were processed as service recovered.
- Function scheduling resumed after connectivity was restored and queued work began catching up.
- Some runs failed during the outage and may need to be replayed. Customers who need help assessing or replaying affected runs can contact [our support team](https://support.inngest.com).

## Timeline

- **11:13 AM:** Function execution becomes unavailable across the platform.
- **11:17 AM:** We declare an incident and begin investigating.
- **11:26 AM:** We publish a status-page update and begin customer communication.
- **11:48 AM:** Connectivity is restored and services begin recovering.
- **12:09 PM:** We move the public status-page incident to Monitoring while we verify recovery and process queued work.

## Root cause

The incident was caused by an interruption to the private network path between our Ashburn environment and AWS-hosted state services. Without that connectivity, the services responsible for state, scheduling, and execution could not operate normally, which led to a platform-wide function execution outage.

The design also exposed a single network failure domain: the loss of one connectivity path could interrupt execution rather than allowing the platform to continue in a degraded mode.

## Corrective actions

We restored the affected connectivity path and monitored service recovery. We are also making the following improvements:

- **Adding independent network redundancy.** We are establishing resilient connectivity between our data centers and AWS-hosted services so that the loss of a single path does not interrupt execution platform-wide. We will regularly validate failover behavior rather than relying on an untested secondary path.
- **Managing network configuration as code.** We are bringing the relevant network configuration under version control and review, so planned changes clearly show their effects, receive peer review, and can be checked for drift.
- **Expanding multi-data-center capacity.** We are continuing our work to add capacity across multiple data centers and to establish reliable connectivity to our new data center. This will reduce the impact of a failure in any one location or network path.
- **Reducing reliance on AWS-hosted dependencies.** As part of this expansion, we plan to move workloads and critical dependencies off AWS where appropriate, reducing the number of cross-environment dependencies required for core execution.
- **Improving dependency and failover monitoring.** We are adding more direct checks of network paths and failover behavior so we can detect a connectivity issue before dependent services become unavailable.

## In closing

We are sorry for the impact this outage had on your applications and customers. Building a more resilient, multi-data-center platform is a priority, and this incident reinforces the importance of independent network paths, reviewed infrastructure changes, and tested failover.

If you have questions about this incident or need help with affected runs, please contact [our support team](https://support.inngest.com).
