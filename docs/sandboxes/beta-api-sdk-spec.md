# Introduction

> **Status:** Experimental beta. This document describes the implemented REST v2 and TypeScript SDK contract as of July 2026. The API is access-gated, the SDK is prerelease software, and the contract may change without a compatibility period.

**Problem and Use Cases**

Customers need isolated compute that agents and applications can program for a bounded session without operating hosts, virtual machines, networking, placement, or machine credentials.

Initial use cases include:

- running tests, builds, and linters;
- letting agents run generated or third-party code;
- installing dependencies and executing a project in a clean environment;
- isolating workloads from the caller's filesystem, processes, and network namespace;
- uploading inputs and downloading generated files;
- capturing stdout, stderr, and exit codes from one-off commands; and
- starting background processes and observing their state and output.

The beta exposes the same compute through two TypeScript surfaces:

- `inngest.sandboxes` is an immediate, server-side REST client; and
- `step.sandbox` runs supported operations as memoized Inngest steps.

The public REST API is also usable without the TypeScript SDK.

The current beta lets customers:

- create, list, get, and destroy sandboxes;
- request vCPU and memory;
- execute a non-interactive command and capture its output;
- stream sandbox logs;
- upload or download one regular file at a time;
- start, list, get, signal, and wait for managed processes;
- read retained process output; and
- tail retained process output and follow new output.

Sandboxes use a platform-provided image and the workspace's default egress-only VPC. A sandbox and every process inside it are identified by canonical lowercase UUIDs.

**Out of Scope**

The following are not part of the beta contract:

- snapshots, cloning, forking, or restore;
- custom images, templates, language runtimes, or OCI images;
- public VPC selection or user-defined network policy;
- ingress, public URLs, SSH, VNC, browser automation, or port forwarding;
- interactive Exec, stdin, PTYs, or terminal resize;
- pause, resume, resize, or migration;
- directory listing, recursive file transfer, append, rename, or delete;
- durable file storage, process recovery, or output storage;
- lifecycle reconciliation after a node or runtime restart;
- secrets management or automatic secret injection;
- a user-configurable sandbox TTL;
- an HTTP idempotency-key contract;
- a CLI or MCP server; and
- live logs, live process output, or file transfer through `step.sandbox`.

These are potential follow-ups, not implied compatibility commitments.

**Starting Questions**

### How does a customer create and use a sandbox?

Call `POST /v2/sandboxes`, `inngest.sandboxes.create()`, or `step.sandbox.create()`. Create returns a full sandbox resource in either `STARTING` or `RUNNING`. Runtime operations require `RUNNING`.

### How does code enter a sandbox?

The beta does not clone repositories or upload directories directly. Customers can:

- upload individual files;
- run an absolute executable already in the image; or
- run a command that downloads or checks out source from the network.

### Which runtimes are available?

The platform resolves the current default image. The public API does not expose an image, template, profile, or language-runtime selector.

### Is creating a sandbox different from running a command?

Yes. Create allocates a live isolated runtime. Captured Exec runs one command inside an existing `RUNNING` sandbox. Managed process Start creates a background process inside that sandbox.

### What happens when capacity is unavailable?

The API returns `503 compute_unavailable` when it can prove that compute did not accept an operation. Reads may be retried with bounded backoff. A mutation that may have reached compute returns `409 operation_ambiguous` and must not be retried automatically.

### How are stdout and stderr returned?

Captured Exec buffers stdout and stderr separately. REST returns base64; the SDK returns `Uint8Array`.

Managed-process output is stored as ordered stdout/stderr chunks in an in-memory ring. Customers can read the retained ring or open an NDJSON stream that emits the retained tail and then follows new output.

### How are output files returned?

Files are downloaded as `application/octet-stream` response bodies. The beta does not have a declared-artifact abstraction.

### How are sandboxes scoped?

Authentication resolves an Inngest account and workspace. Every lookup also checks both scopes and the sandbox workload type. A resource in another workspace is indistinguishable from a missing resource.

### Does the beta provide exactly-once mutations?

No. There is no public `Idempotency-Key` contract. Completed `step.sandbox` steps are memoized, but the ordinary at-least-once step window still exists if a REST mutation completes and the function process stops before the step result is persisted.

# Implementation

**Research**

The design was informed by:

- [Sprites API](https://sprites.dev/api/sprites), including resource-oriented lifecycle, command sessions, checkpoints, files, and network policy;
- [E2B Sandboxes](https://e2b.dev/docs/sandbox), including lifecycle, templates, filesystems, foreground commands, and background commands;
- [Daytona Sandboxes](https://www.daytona.io/docs/en/sandboxes/), including snapshots, process execution, files, and log streaming;
- [Blaxel Sandboxes](https://docs.blaxel.ai/Sandboxes/Overview), including a sandbox-local API for process and file operations;
- [Vercel Sandbox SDK](https://vercel.com/docs/sandbox/sdk-reference); and
- [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/api/).

The beta deliberately implements a smaller surface:

- one stable sandbox resource instead of separate create and runtime models;
- an explicit distinction between captured commands and managed processes;
- raw, byte-safe output instead of assuming UTF-8 or line boundaries;
- a direct REST client plus a separate durable-function surface; and
- honest ambiguity and retention boundaries instead of implied exactly-once execution or durable logs.

**High level**

```text
Direct server code
  inngest.sandboxes
          |
          | HTTPS / REST v2
          v
Inngest REST API ---- workspace auth, entitlements, rate limits
          |
          | trusted SandboxService RPC
          v
Compute control plane ---- sandbox lifecycle and node placement
          |
          | authenticated Iroh session
          v
Simcity node ---- VM lifecycle, files, commands, processes, output rings
          |
          v
Isolated Linux guest
```

Inside an Inngest function:

```text
step.sandbox
    |
    | sandbox middleware
    v
ordinary step.run ---- persisted result and replay
    |
    v
inngest.sandboxes ---- same REST v2 API shown above
```

The control plane stores sandbox lifecycle state. Managed-process metadata and output are live, sandbox-local runtime state and are not stored durably.

### Core Invariants

- Public sandbox and process IDs are canonical lowercase UUIDs.
- Internal runtime handles such as `p1` are never exposed.
- Create, Get, and List return the same complete sandbox resource shape.
- Lifecycle and process states are uppercase stable strings.
- Runtime operations require a `RUNNING` sandbox.
- All lookups are scoped to the authenticated account and workspace.
- Direct streams and file bodies are never exposed through `step.sandbox`.
- Output is bytes. Text decoding is an application decision.
- `operation_ambiguous` is never retried automatically.

### Resource Model

#### Sandbox

```ts
interface SandboxResource {
  id: string;
  name: string;
  status:
    | "PENDING"
    | "STARTING"
    | "RUNNING"
    | "PAUSED"
    | "TERMINATING"
    | "TERMINATED"
    | "FAILED";
  vpcId: string;
  imageRef: string;
  resources: {
    vcpu: number;
    memoryMb: number;
  };
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  error?: string;
}
```

`vpcId` and `imageRef` describe what the platform resolved. They are not create-time selectors.

Create returns only `STARTING` or `RUNNING`. Captured commands, logs, files, and process operations require `RUNNING`.

#### Managed Process

```ts
interface SandboxProcessResource {
  id: string;
  command: readonly string[];
  pid?: number;
  state: "STARTING" | "RUNNING" | "EXITED" | "KILLED" | "FAILED" | "LOST";
  exitCode?: number;
  terminationSignal?: number;
  startedAt?: string;
  endedAt?: string;
}
```

`exitCode` appears only for `EXITED`. `terminationSignal` appears only for `KILLED`.

`LOST` means the runtime can no longer provide a trustworthy terminal result. It is different from a confirmed non-zero exit.

### Lifecycle

The complete status vocabulary is:

```text
PENDING -> STARTING -> RUNNING -> TERMINATING -> TERMINATED
                 \                       /
                  +------> FAILED <-----+
```

`PAUSED` is reserved in the resource model but pause and resume are not public beta operations.

Create is asynchronous:

- HTTP 201 means the returned resource is already `RUNNING`.
- HTTP 202 means the returned resource is `STARTING`.

There is no dedicated readiness endpoint or `waitUntilRunning()` SDK helper. Poll Get with a bounded timeout. Every Sandbox object is an immutable resource snapshot, so a later Get returns a new object.

Destroy can return:

- HTTP 202 and a `TERMINATING` resource; or
- HTTP 204 when teardown completed synchronously.

Destroy removes the guest filesystem, processes, and retained output.

### Authentication and Workspace Selection

REST requests use:

```text
Authorization: Bearer <INNGEST_API_KEY>
```

A workspace-scoped key selects its workspace. An account-scoped key also requires:

```text
X-Inngest-Env: production
```

The TypeScript client uses the credentials, API origin, environment headers, Fetch implementation, and other request headers configured on its `Inngest` instance.

Sandbox clients are server-only. Never put an API or signing key in a browser bundle.

### REST v2 Conventions

Cloud origin:

```text
https://api.inngest.com
```

Most successful JSON responses use:

```json
{
  "data": {},
  "metadata": {
    "fetchedAt": "2026-07-30T12:00:00.123456789Z"
  }
}
```

List responses add:

```json
{
  "page": {
    "cursor": "opaque",
    "hasMore": true,
    "limit": 50
  }
}
```

JSON request bodies:

- reject unknown fields;
- reject trailing or multiple JSON values; and
- are capped at 1 MiB for Create, captured Exec, process Start, and Signal.

Errors use:

```json
{
  "errors": [
    {
      "code": "invalid_field_format",
      "message": "command must begin with an absolute executable path"
    }
  ]
}
```

Clients must branch on `code`, not `message`. Live resources and output use `Cache-Control: no-store`.

### Sandbox Management

| Operation | Method and path | Behavior |
| --- | --- | --- |
| Create | `POST /v2/sandboxes` | Allocate a sandbox |
| List | `GET /v2/sandboxes?cursor=&limit=` | List workspace sandboxes |
| Get | `GET /v2/sandboxes/{sandboxId}` | Get current state |
| Destroy | `DELETE /v2/sandboxes/{sandboxId}` | Begin or observe teardown |
| Captured Exec | `POST /v2/sandboxes/{sandboxId}/exec` | Run one command and buffer output |
| Logs | `GET /v2/sandboxes/{sandboxId}/logs` | Stream sandbox logs as NDJSON |
| Upload file | `PUT /v2/sandboxes/{sandboxId}/files` | Atomically replace one regular file |
| Download file | `GET /v2/sandboxes/{sandboxId}/files` | Stream one regular file |

### Creation Request

```text
POST /v2/sandboxes
Authorization: Bearer ...
Content-Type: application/json
```

```json
{
  "name": "agent_job-42",
  "vcpu": 2,
  "memoryMb": 512
}
```

| Field | Rules |
| --- | --- |
| `name` | Required; 1–63 lowercase letters, digits, `_`, or `-` |
| `vcpu` | Required positive unsigned 32-bit integer |
| `memoryMb` | Required positive unsigned 32-bit integer in MiB |

There is no `image`, `template`, `profile`, `vpcId`, disk-size, command, or TTL field.

### Create Response

```json
{
  "data": {
    "id": "b066bdf7-a57b-4d8b-a1a7-76eab1f91273",
    "name": "agent_job-42",
    "status": "STARTING",
    "vpcId": "5f82a217-9d54-4fa8-a9be-d1dbba8a8db2",
    "imageRef": "default",
    "resources": {
      "vcpu": 2,
      "memoryMb": 512
    },
    "createdAt": "2026-07-30T12:00:00.123456789Z",
    "startedAt": null,
    "endedAt": null
  },
  "metadata": {
    "fetchedAt": "2026-07-30T12:00:00.200000000Z"
  }
}
```

Name uniqueness applies to active resources in the workspace.

There is no HTTP `Idempotency-Key`. If Create returns `operation_ambiguous`, the sandbox may exist. Reconcile by listing and inspecting the intended unique name instead of automatically creating again.

### List Sandboxes

```text
GET /v2/sandboxes?limit=50&cursor=<opaque>
```

`limit` defaults to 50 and accepts 1–250. Results include retained terminal resources and are ordered by `createdAt DESC`, then `id DESC`.

Pagination is keyset-based. Pass `page.cursor` back unchanged only when `page.hasMore` is true. Do not decode or construct cursors.

The beta has no name, status, image, or VPC filters.

### Get a Sandbox

```text
GET /v2/sandboxes/{sandboxId}
```

Get returns the complete current resource. A missing or workspace-hidden sandbox returns `404 sandbox_not_found`.

### Destroy a Sandbox

```text
DELETE /v2/sandboxes/{sandboxId}
```

The service persists teardown intent before contacting the node. A successful request returns either the `TERMINATING` resource with HTTP 202 or no body with HTTP 204.

### Captured Exec

```text
POST /v2/sandboxes/{sandboxId}/exec
Content-Type: application/json
```

```json
{
  "command": ["/bin/sh", "-c", "printf 'tests passed\n'"],
  "environment": {
    "PATH": "/usr/local/bin:/usr/bin:/bin",
    "CI": "true"
  },
  "cwd": "/workspace",
  "timeout": "5m"
}
```

| Field | Default | Rules |
| --- | --- | --- |
| `command` | Required | Argument vector; item 0 must be absolute |
| `environment` | Guest default | Replaces the complete guest environment |
| `cwd` | `/` | Working directory |
| `timeout` | `30s` | Positive Go duration, maximum `5m` |

The API does not shell-parse `command`. Invoke `/bin/sh` or another shell explicitly when shell syntax is required.

Response:

```json
{
  "data": {
    "stdout": "dGVzdHMgcGFzc2VkCg==",
    "stderr": "",
    "encoding": "base64",
    "exitCode": 0
  },
  "metadata": {
    "fetchedAt": "2026-07-30T12:01:00Z"
  }
}
```

A non-zero exit is a successful HTTP response. The caller decides whether the exit code represents application failure.

Direct REST buffers at most 4 MiB across stdout and stderr. Exceeding the limit returns `413 sandbox_exec_output_too_large`. A timeout returns `504 sandbox_exec_timed_out`. In both cases the command may have executed, so the error is ambiguous and non-retryable.

Captured Exec is not interactive and does not accept stdin.

### Sandbox Logs

```text
GET /v2/sandboxes/{sandboxId}/logs?follow=false
Accept: application/x-ndjson
```

`follow` defaults to `false`.

Log frame:

```json
{"type":"log","stream":"STDOUT","data":"c3RhcnRlZAo=","encoding":"base64","at":"2026-07-30T12:00:00Z"}
```

The endpoint can commit HTTP 200 before upstream admission finishes. Admission or live failures after headers use a terminal frame:

```json
{"type":"error","errors":[{"code":"compute_unavailable","message":"Compute is temporarily unavailable"}]}
```

Consumers must parse every frame. HTTP 200 alone does not prove a successful stream. Logs are live runtime output, not durable log storage.

### Files

#### Upload or Replace

```text
PUT /v2/sandboxes/{sandboxId}/files?path=/tmp/input.bin&mode=0640
Content-Type: application/octet-stream
```

The request body is the raw file.

| Value | Limit |
| --- | --- |
| Path | Absolute, no NUL, at most 4096 UTF-8 bytes |
| Mode | Octal `0001`–`0777`; default `0644` |
| Body | At most 100 MiB |
| Type | Regular file only |

Upload atomically replaces the complete destination. It cannot replace `/`, a directory, symlink, device, socket, or FIFO.

Success returns:

```json
{
  "data": {
    "path": "/tmp/input.bin",
    "bytesWritten": 12
  },
  "metadata": {
    "fetchedAt": "2026-07-30T12:00:05Z"
  }
}
```

A transport failure after replacement may return `operation_ambiguous`.

#### Download

```text
GET /v2/sandboxes/{sandboxId}/files?path=/tmp/output.bin
```

The response is `application/octet-stream` and includes `Content-Length`, `X-Sandbox-File-Mode`, and, when available, `Last-Modified`.

Only regular files up to 100 MiB are downloadable. A binary stream cannot add a JSON error after HTTP 200, so a body shorter than `Content-Length` is a failed download.

The beta has no list, append, ranged write, delete, rename, directory, symlink, or recursive transfer operation.

### Managed Processes

| Operation | Method and path |
| --- | --- |
| Start | `POST /v2/sandboxes/{sandboxId}/processes` |
| List | `GET /v2/sandboxes/{sandboxId}/processes?cursor=&limit=` |
| Get | `GET /v2/sandboxes/{sandboxId}/processes/{processId}` |
| Signal | `POST /v2/sandboxes/{sandboxId}/processes/{processId}/signals` |
| Wait | `POST /v2/sandboxes/{sandboxId}/processes/{processId}/wait` |
| Retained output | `GET /v2/sandboxes/{sandboxId}/processes/{processId}/output` |
| Streaming output | `GET /v2/sandboxes/{sandboxId}/processes/{processId}/output/stream` |

Managed processes are appropriate for servers, workers, watchers, and other commands that must continue after Start returns.

#### Start

```json
{
  "command": ["/bin/sh", "-c", "exec /usr/bin/my-server"],
  "environment": {
    "PATH": "/usr/local/bin:/usr/bin:/bin",
    "PORT": "8080"
  },
  "cwd": "/workspace"
}
```

Start returns HTTP 201 only after the target process is confirmed `RUNNING`:

```json
{
  "data": {
    "id": "45cef567-a28c-4109-b464-bc9c504ea900",
    "command": ["/bin/sh", "-c", "exec /usr/bin/my-server"],
    "pid": 87,
    "state": "RUNNING"
  },
  "metadata": {
    "fetchedAt": "2026-07-30T12:00:02Z"
  }
}
```

The control plane generates the public UUID before dispatch and passes it to the node. Guest-generated handles are filtered out.

Start has no HTTP idempotency key. An ambiguous response can leave a running process whose UUID was not received by the caller.

#### List and Get

List returns processes sorted by UUID. `limit` defaults to 50 and is capped at
250. Pagination cursors are opaque.

Get returns one process or `404 sandbox_process_not_found`.

Process metadata is in-memory state. It disappears with the sandbox and may be lost if the runtime is lost.

#### Signal

```json
{
  "signal": 15,
  "includeChildren": false
}
```

`signal` is an integer from 1 through 64. `includeChildren` defaults to false. Success returns HTTP 204. Signalling an already-terminal process is a no-op.

Signal is a mutation. Never automatically resend `operation_ambiguous`.

Current beta limitation: use `includeChildren: true` only with signal 9 (`SIGKILL`). Non-SIGKILL descendant delivery cannot be made race-free and can leave terminal state unobservable.

#### Wait

```text
POST /v2/sandboxes/{sandboxId}/processes/{processId}/wait?timeout=30s
```

Wait has no body. `timeout` defaults to 30 seconds and is capped at five minutes.

Wait returns a terminal state. A `504 sandbox_process_wait_timed_out` response ends only the observation. It does not stop or signal the process, and waiting again is safe.

There is no process runtime timeout. Applications must signal processes they no longer need.

#### Retained Output

```text
GET /v2/sandboxes/{sandboxId}/processes/{processId}/output?tailBytes=65536
```

`tailBytes` accepts 0–524,288. Zero means all retained output.

```json
{
  "data": {
    "chunks": [
      {
        "stream": "STDOUT",
        "data": "c2VydmVyIHN0YXJ0ZWQK",
        "encoding": "base64",
        "at": "2026-07-30T12:00:03Z"
      },
      {
        "stream": "STDERR",
        "data": "d2FybmluZwo=",
        "encoding": "base64",
        "at": "2026-07-30T12:00:04Z"
      }
    ]
  },
  "metadata": {
    "fetchedAt": "2026-07-30T12:00:05Z"
  }
}
```

Chunks preserve observed stdout/stderr ordering and arbitrary bytes. They are not line records. Tail selection preserves complete chunks and can cross the requested boundary by one chunk.

The API distinguishes:

```text
404 sandbox_process_not_found
404 sandbox_process_output_not_retained
```

The second code means the process metadata still exists but its output ring was evicted.

#### Streaming Output

```text
GET /v2/sandboxes/{sandboxId}/processes/{processId}/output/stream?tailBytes=8192
Accept: application/x-ndjson
```

The stream always emits the retained tail and then follows live output. There is no `follow` option.

Admission failures return a normal non-200 JSON error before headers. A failure after HTTP 200 sends the same terminal `errors` frame used by sandbox logs.

The stream is best effort:

- a slow consumer can miss chunks;
- frames have no sequence number, resume token, or loss marker;
- the SDK never reconnects automatically; and
- manually reconnecting can replay retained chunks and create duplicates.

#### Output Retention

- Each process ring retains approximately 512 KiB across stdout and stderr.
- Only the newest 32 process rings are retained.
- Starting more processes can evict an older ring while metadata remains.
- Output is memory-only and disappears with the sandbox.

Persist important results to a file or external store.

### Error Model

| HTTP | Code | Meaning | Retry guidance |
| ---: | --- | --- | --- |
| 400 | `invalid_request` | Invalid JSON or unknown fields | Fix request |
| 400 | `missing_field` | Required field missing | Fix request |
| 400 | `invalid_field_format` | Invalid ID, command, signal, duration, cursor, path, mode, or tail | Fix request |
| 401 | `authorization_header_missing` | Missing credentials | Fix credentials |
| 401 | `invalid_api_key` | Invalid credentials | Rotate or replace |
| 403 | `access_denied` | Beta not enabled | Request access |
| 404 | `sandbox_not_found` | Sandbox missing or hidden | Reconcile target |
| 404 | `sandbox_file_not_found` | File or sandbox missing | Reconcile target |
| 404 | `sandbox_process_not_found` | Process missing | Reconcile target |
| 404 | `sandbox_process_output_not_retained` | Output ring evicted | Cannot recover from this API |
| 409 | `sandbox_name_taken` | Active name already exists | Choose or inspect name |
| 409 | `invalid_request` | Resource not in required state | Get current state |
| 409 | `operation_ambiguous` | Mutation may have happened | Never retry automatically |
| 413 | `sandbox_exec_output_too_large` | Captured output exceeded 4 MiB | Command may have run |
| 413 | `sandbox_file_too_large` | File exceeded 100 MiB | Reduce or split |
| 429 | `rate_limited` | Rejected by rate limit | Retry safe operations with backoff |
| 500 | `internal_error` | Unexpected failure | Retry only when proven safe |
| 503 | `compute_unavailable` | Compute unavailable before confirmed dispatch | Safe reads may retry |
| 504 | `sandbox_exec_timed_out` | Exec observation timed out | Command may have run |
| 504 | `sandbox_process_wait_timed_out` | Wait observation timed out | Waiting again is safe |

Safe reads include List, Get, Wait, retained output, streams, and file download.

Mutations include Create, captured Exec, Destroy, Start, Signal, and file upload.

A mutation may retry only when the service proves rejection before dispatch. A missing response is not proof. The direct SDK conservatively maps a transport failure during a mutation to `operation_ambiguous`.

### Validation Limits

#### Sandbox

| Value | Limit |
| --- | --- |
| Name | 1–63 lowercase letters, digits, `_`, or `-` |
| vCPU | Positive unsigned 32-bit integer |
| Memory | Positive unsigned 32-bit integer in MiB |
| Sandbox List page | Default 50, maximum 250 |
| Create body | 1 MiB |

Entitlements and capacity can impose lower effective resource limits.

#### Commands and Process Start

| Value | Limit |
| --- | --- |
| Argument count | 1–128 |
| Total argument UTF-8 bytes | 32 KiB |
| Environment entries | 256 |
| Total environment `KEY=value` bytes | 64 KiB |
| Working-directory UTF-8 bytes | 4096 |
| Encoded process specification | 96 KiB |
| JSON body | 1 MiB |

Arguments, environment keys and values, and `cwd` cannot contain NUL. Environment keys must be non-empty and cannot contain `=`.

#### Time and Output

| Value | Limit |
| --- | --- |
| Captured Exec default timeout | 30 seconds |
| Captured Exec maximum timeout | 5 minutes |
| Direct captured stdout + stderr | 4 MiB |
| Durable retained stdout + stderr | 2 MiB |
| Process Wait default | 30 seconds |
| Process Wait maximum | 5 minutes |
| Retained process output | Approximately 512 KiB |
| Retained process rings | Newest 32 |
| `tailBytes` | 0–524,288 |

## TypeScript SDK

### Beta Installation

Until the SDK change is released normally:

```sh
npm install inngest@pr-1654
```

The prerelease is for evaluation only. Commit the lockfile so the tested build does not move unexpectedly.

### Client Setup

```ts
import { Inngest } from "inngest";
import { sandboxMiddleware } from "inngest/experimental";

export const inngest = new Inngest({
  id: "sandbox-beta-demo",
  middleware: [sandboxMiddleware()],
});
```

The middleware enables `step.sandbox`. The direct `inngest.sandboxes` client does not require it.

The SDK needs a server-side API or signing key. The client reads the standard Inngest environment configuration.

### Choose a Surface

| Capability | `inngest.sandboxes` | `step.sandbox` |
| --- | :-: | :-: |
| Create, List, Get, Destroy | Yes | Yes |
| Captured Exec | Yes | Yes |
| Process Start, List, Get, Signal, Wait | Yes | Yes |
| Retained process output | Yes | Yes |
| Sandbox logs | Yes | No |
| Live process output | Yes | No |
| File upload and download | Yes | No |

Use `inngest.sandboxes` from server routes, workers, scripts, or other code that owns its request lifecycle.

Use `step.sandbox` inside an Inngest function when the operation and its result should be memoized as a step.

### Direct Getting Started

```ts
import type { Sandbox } from "inngest";
import { inngest } from "./client";

const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitUntilRunning(
  sandbox: Sandbox,
  timeoutMs = 60_000
): Promise<Sandbox> {
  const deadline = Date.now() + timeoutMs;
  let current = sandbox;

  while (current.status === "STARTING" && Date.now() < deadline) {
    await sleep(1_000);

    const loaded = await inngest.sandboxes.get(current.id);
    if (!loaded) {
      throw new Error("Sandbox disappeared while starting");
    }
    current = loaded;
  }

  if (current.status !== "RUNNING") {
    throw new Error(`Sandbox did not become RUNNING: ${current.status}`);
  }

  return current;
}

let sandbox: Sandbox | undefined;

try {
  sandbox = await inngest.sandboxes.create({
    name: `beta-${crypto.randomUUID()}`,
    vcpu: 2,
    memoryMb: 512,
  });

  sandbox = await waitUntilRunning(sandbox);

  const result = await sandbox.commands.run({
    command: ["/bin/sh", "-c", "printf 'hello from the sandbox\n'"],
    cwd: "/",
    timeout: "30s",
  });

  console.log(new TextDecoder().decode(result.stdout));
  console.log(result.exitCode);
} finally {
  await sandbox?.destroy();
}
```

The direct client never retries automatically. The caller owns readiness, retry policy, cancellation, and cleanup.

### Durable Getting Started

```ts
import { inngest } from "./client";

export const runInSandbox = inngest.createFunction(
  {
    id: "run-in-sandbox",
    triggers: [{ event: "sandbox/demo.requested" }],
  },
  async ({ event, step }) => {
    let sandbox = await step.sandbox.create("create-sandbox", {
      name: `beta-${event.data.jobId}`,
      vcpu: 2,
      memoryMb: 512,
    });

    for (
      let attempt = 0;
      sandbox.status === "STARTING" && attempt < 60;
      attempt++
    ) {
      await step.sleep(`wait-for-sandbox-${attempt}`, "1s");

      const current = await step.sandbox.get(
        `get-sandbox-${attempt}`,
        sandbox.id
      );
      if (!current) {
        throw new Error("Sandbox disappeared while starting");
      }
      sandbox = current;
    }

    if (sandbox.status !== "RUNNING") {
      throw new Error(`Sandbox did not become RUNNING: ${sandbox.status}`);
    }

    const result = await sandbox.commands.run("run-command", {
      command: ["/bin/sh", "-c", "printf 'hello from a durable step\n'"],
      timeout: "30s",
    });

    await sandbox.destroy("destroy-sandbox");

    return {
      sandboxId: sandbox.id,
      stdout: new TextDecoder().decode(result.stdout),
      stderr: new TextDecoder().decode(result.stderr),
      exitCode: result.exitCode,
      outputWasTruncated: result.output.truncated,
    };
  }
);
```

Every durable operation requires a stable, unique step ID. Let unexpected errors escape so Inngest can apply the SDK's retry classification. Catch an error only when implementing an intentional fallback or compensation path.

Destroy on the success path does not run after a permanently failed function. Use an Inngest failure handler or external cleanup policy when leaked sandboxes are unacceptable.

### Sandbox Objects and Reconnection

SDK Sandbox objects are immutable snapshots. A mutation does not change the object on which it was called.

Use Get for current state:

```ts
const current = await inngest.sandboxes.get(sandbox.id);
```

There is intentionally no `refresh()` alias.

Persist the sandbox ID when work needs to reconnect later:

```ts
const sandbox = await inngest.sandboxes.get(sandboxId);
```

The durable surface uses the same ID-based pattern:

```ts
const current = await step.sandbox.get("load-sandbox", sandboxId);
```

There is no public snapshot attachment or reconstruction API. Middleware serializes and reconstructs durable operation results internally.

### List Sandboxes

Direct:

```ts
const first = await inngest.sandboxes.list({ limit: 50 });

for (const sandbox of first.items) {
  console.log(sandbox.id, sandbox.status);
}

if (first.page.hasMore && first.page.cursor) {
  const next = await inngest.sandboxes.list({
    limit: first.page.limit,
    cursor: first.page.cursor,
  });
  console.log(next.items.length);
}
```

Durable:

```ts
const page = await step.sandbox.list("list-sandboxes", { limit: 50 });
```

### Captured Commands

Direct:

```ts
const result = await sandbox.commands.run({
  command: ["/usr/bin/env", "node", "--version"],
  environment: {
    PATH: "/usr/local/bin:/usr/bin:/bin",
  },
  cwd: "/workspace",
  timeout: "30s",
});
```

Durable:

```ts
const result = await sandbox.commands.run("node-version", {
  command: ["/usr/bin/env", "node", "--version"],
  environment: {
    PATH: "/usr/local/bin:/usr/bin:/bin",
  },
});
```

`stdout` and `stderr` are `Uint8Array`.

Direct results contain at most 4 MiB and report:

```ts
result.output // { truncated: false }
```

The durable middleware retains at most 2 MiB so the JSON-safe, base64-encoded step result fits the executor output limit. Larger successful results keep deterministic tails:

```ts
if (result.output.truncated) {
  console.log(result.output.strategy); // "tail"
  console.log(result.output.originalBytes);
  console.log(result.output.retainedBytes);
}
```

### Managed Processes

Direct:

```ts
let worker = await sandbox.processes.start({
  command: [
    "/bin/sh",
    "-c",
    "printf 'worker started\n'; exec /bin/sleep 30",
  ],
  cwd: "/",
});

const retained = await worker.getOutput({ tailBytes: 64 * 1024 });
const outputDecoders = {
  STDOUT: new TextDecoder(),
  STDERR: new TextDecoder(),
};

for (const chunk of retained.chunks) {
  console.log(
    chunk.stream,
    outputDecoders[chunk.stream].decode(chunk.data, { stream: true })
  );
}

await worker.signal({
  signal: 9,
  includeChildren: true,
});

worker = await worker.wait({ timeout: "30s" });
console.log(worker.state, worker.terminationSignal);
```

Durable:

```ts
let worker = await sandbox.processes.start("start-worker", {
  command: ["/bin/sh", "-c", "exec /bin/sleep 30"],
});

const retained = await worker.getOutput("read-worker-output", {
  tailBytes: 64 * 1024,
});

await worker.signal("stop-worker", {
  signal: 9,
  includeChildren: true,
});

worker = await worker.wait("wait-worker", { timeout: "30s" });
```

Process List and Get are available on both surfaces. A missing Get returns `null`.

### Live Process Output

Live process output is direct-only:

```ts
const stream = await worker.streamOutput({ tailBytes: 8 * 1024 });
const reader = stream.getReader();
const outputDecoders = {
  STDOUT: new TextDecoder(),
  STDERR: new TextDecoder(),
};

try {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    console.log(
      value.stream,
      outputDecoders[value.stream].decode(value.data, { stream: true })
    );
  }
} finally {
  await reader.cancel();
}
```

Cancelling the reader aborts the request. A terminal NDJSON error frame becomes a `SandboxError` from `reader.read()`. The client does not reconnect.

### Sandbox Logs

Logs are direct-only:

```ts
const stream = await sandbox.logs.stream({ follow: true });
const reader = stream.getReader();

try {
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    console.log(value.stream, value.data);
  }
} finally {
  await reader.cancel();
}
```

### Files

Files are direct-only:

```ts
await sandbox.files.upload({
  path: "/tmp/input.txt",
  data: "hello from the host\n",
  mode: 0o640,
});

const response = await sandbox.files.download({
  path: "/tmp/input.txt",
});

if (!response.ok) {
  throw new Error(`Download failed: ${response.status}`);
}

console.log(await response.text());
```

The download method returns a Fetch `Response` so callers can stream bytes without buffering them in the SDK.

### SDK Errors and Retries

Request and API failures use:

```ts
class SandboxError extends Error {
  action: SandboxAction;
  code: SandboxErrorCode;
  status?: number;
  sandboxId?: string;
  processId?: string;
  ambiguous: boolean;
  retryable: boolean;
  requestId?: string;
  details: readonly Record<string, unknown>[];
  cause?: unknown;
}
```

Invalid local input and malformed server responses throw `SandboxValidationError`.

The direct client never retries, even when `retryable` is true.

The middleware maps:

- retryable `SandboxError` to an ordinary retriable step error;
- non-retryable `SandboxError` to `NonRetriableError`; and
- `SandboxValidationError` to `NonRetriableError`.

This classification does not make mutations exactly once.

### `step.sandbox` Replay Semantics

The middleware uses ordinary `step.run`:

1. the step handler sends the REST request;
2. the SDK converts the result to JSON-safe data;
3. Inngest persists the step result; and
4. replay reconstructs a Sandbox object from the persisted result.

A persisted step is not sent again on replay. However, if a REST mutation commits and the function process stops before step persistence, the step handler can run again.

There is no sandbox-specific executor fence and no public HTTP idempotency key in the middleware-backed beta.

An observed `operation_ambiguous` is non-retryable. A process crash cannot report ambiguity, so mutation commands should still tolerate ordinary at-least-once execution.

### Cleanup

The caller owns cleanup.

- Direct code should use `finally`.
- An Inngest function should destroy on its normal success path.
- A function that can fail permanently should use an `onFailure` cleanup strategy or an external reaper.
- Cleanup must tolerate a sandbox that is already terminating, terminal, or missing.

**Alternatives**

### Synchronous Create

Create could wait until `RUNNING`, but startup can exceed one request's useful latency and capacity failures need an observable resource. The beta returns honest 201 `RUNNING` or 202 `STARTING` instead.

A future SDK helper such as `waitUntilRunning({ timeout })` can remove polling boilerplate without changing the REST lifecycle contract.

### Executor-Owned Sandbox Opcodes

An executor opcode can provide stronger mutation dispatch fencing than ordinary `step.run`, but it requires coordinated SDK and executor rollout. The current beta uses middleware and the public REST API so it can ship and iterate independently.

Stronger fencing remains desirable for Create, captured Exec, Start, Signal, Destroy, and file upload.

### One Command Abstraction

Combining captured commands and managed processes would hide important differences in lifetime, output retention, signalling, and retry safety. The beta keeps `commands.run()` and `processes.start()` explicit.

### String Commands and Language Helpers

APIs such as `sandbox.bash()` or `sandbox.python()` are concise but imply a shell or runtime that may not exist in the selected image. The canonical API uses an argv array and requires an absolute executable.

Language helpers can be additive conveniences once runtime selection is defined.

### Full Filesystem API

A large filesystem surface is convenient but increases security, streaming, and atomicity complexity. The beta starts with whole-file upload and download.

### Snapshots in the First Release

Snapshots materially change storage, identity, retention, and create idempotency. They are intentionally separate from the initial live-runtime contract.

**Risks & Assumptions**

- Customers familiar with E2B-like products may expect terminals, snapshots, public URLs, and runtime selection that are not present.
- A `STARTING` response requires bounded polling and explicit cleanup.
- The default image must contain the binaries used by customer commands.
- Replacing rather than merging environment variables can accidentally remove `PATH` and other required variables.
- An ambiguous Start can leave a process whose UUID the caller never received.
- Ordinary step replay can duplicate a mutation before its result is persisted.
- Process metadata and output can disappear during runtime loss.
- Best-effort streams can lose or duplicate output.
- A 4 MiB direct Exec output cap may be too small for build and test logs.
- File upload and download are not a substitute for durable artifact storage.
- The lack of a TTL or automated cleanup can leak capacity.
- Returning `vpcId` and `imageRef` may create expectations that they are selectable.

**Security Impact**

- All APIs require server-side credentials.
- Authorization scopes every sandbox to an account and workspace.
- Scoped 404s do not reveal resources in another workspace.
- Sandboxes run in isolated Linux guests rather than the caller's process or filesystem.
- Create uses the workspace's default egress-only VPC; users cannot select a network or expose ingress.
- The beta does not provide a secrets abstraction. Values passed in `environment` are available to the guest process and must be treated as exposed to code running there.
- Uploaded files and command arguments can contain untrusted data. The control plane must not log their contents.
- Public process IDs are generated by the control plane; internal handles are filtered.
- Paths must be absolute, reject NUL, and are resolved inside the guest.
- File APIs reject non-regular files to avoid device, socket, and symlink behavior crossing the API boundary.
- Stream payloads use base64 so arbitrary bytes cannot corrupt NDJSON framing.

Security review should cover guest isolation, egress policy, API-key handling, path traversal, symlink races, process signalling authority, rate limits, and logging redaction before general availability.

**Observability & Debugging**

### Customer-Visible Signals

Customers can use:

- sandbox lifecycle state and timestamps;
- process state, PID, timestamps, exit code, and termination signal;
- captured stdout and stderr;
- sandbox log and process-output streams;
- stable error codes;
- `SandboxError.requestId`;
- sandbox and process UUIDs; and
- file response size and modification metadata.

Support requests should include the operation, workspace, request ID, sandbox ID, process ID, error code, and whether retrying could duplicate a mutation.

### Platform Telemetry

The service should measure:

- Create latency to `STARTING` and `RUNNING`;
- capacity rejection and scheduling failure rate;
- active and leaked sandboxes by workspace;
- lifecycle duration and Destroy completion latency;
- API latency and error rate by action and code;
- `operation_ambiguous` rate by mutation;
- node-session and transport failures;
- captured Exec timeout and output-limit rate;
- process Start, terminal state, Wait timeout, and `LOST` rate;
- output-ring eviction and slow-subscriber loss;
- stream admission and post-header terminal errors;
- file bytes transferred, short downloads, and ambiguous uploads; and
- durable result truncation frequency and byte counts.

Alerts should focus on sustained capacity failure, increasing ambiguity, orphaned `TERMINATING` resources, node disconnects, stream failures, and unexpected `LOST` process rates.

**Unknowns & Open Questions**

### Near-Term API Decisions

- Should Create accept an SDK-only `runningTimeout`, or should the Sandbox object expose `waitUntilRunning({ timeout })`?
- What vCPU and memory combinations are supported and how are entitlement errors communicated before scheduling?
- What sandbox lifetime and concurrency limits will be documented and priced?
- Should sandbox and process List gain additive status or name filters?
- Should process Start expose an application-provided idempotency key?
- Should process streams add sequence numbers, dropped-chunk metadata, or a resume token?
- Should log streaming perform admission before HTTP 200, matching process output streaming?
- What automatic cleanup or reaper guarantees are required for beta users?

### Product Follow-Ups

- custom images, templates, and locked dependency environments;
- snapshots and cloning;
- ingress and authenticated public services;
- network policy and customer-selectable VPCs;
- durable artifacts and recursive file transfer;
- secrets;
- interactive terminal and Exec;
- CLI and MCP wrappers;
- TypeScript, Python, and Go convenience layers;
- runtime recovery and lifecycle reconciliation; and
- durable processes and output.

**Rollout plan & Success Metrics**

### Rollout

1. Keep the REST API entitlement-gated.
2. Publish the TypeScript SDK as `inngest@pr-1654` for selected beta users.
3. Validate complete lifecycle E2E against a production-like Simcity stack.
4. Collect API, naming, polling, retry, output, and cleanup feedback.
5. Resolve high-risk ambiguity, cleanup, and signalling issues.
6. Publish a normal SDK version when the contract is ready for a compatibility commitment.
7. Expand entitlements gradually while monitoring capacity and failure rates.

### Success Metrics

- sandbox Create success rate and time to `RUNNING`;
- percentage of beta users completing Create, command or process, and Destroy;
- sandbox cleanup success and leaked-resource rate;
- command and process success rates;
- ambiguity and duplicate-mutation reports;
- output truncation, eviction, and stream-loss reports;
- SDK adoption split between direct and durable surfaces;
- support tickets per active beta workspace;
- repeated weekly beta use; and
- conversion of beta use cases into production-ready requirements.

Pricing, resource quotas, and general-availability SLOs are not defined by this spec.

**Documentation**

Public documentation must include:

- a short beta getting-started guide;
- a TypeScript SDK reference for both surfaces;
- a complete REST v2 reference;
- managed-process guidance;
- errors and retries;
- current limitations; and
- copyable examples verified against the beta package and local lifecycle stack.

The public getting-started guide should remain task-focused. This document is the comprehensive implementation and product contract used to keep the REST reference, SDK reference, examples, and limitations consistent.
