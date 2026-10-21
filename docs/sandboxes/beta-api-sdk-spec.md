# Introduction

> **Status:** Experimental beta. This document describes the implemented REST v2 contract and Inngest SDK 4.21 as of September 2026. The API is access-gated, and the contract may change without a compatibility period.

**Problem and Use Cases**

Customers need isolated compute that agents and applications can program for a bounded session without operating hosts, virtual machines, networking, placement, or machine credentials.

Initial use cases include:

- running tests, builds, and linters
- letting agents run generated or third-party code
- installing dependencies and executing a project in a clean environment
- isolating workloads from the caller's filesystem, processes, and network namespace
- uploading inputs and downloading generated files
- capturing stdout, stderr, and exit codes from one-off commands
- starting background processes and observing their state and output.

The beta exposes the same compute through two TypeScript surfaces:

- `inngest.sandboxes` is an immediate, server-side REST client
- `step.sandbox` runs supported operations as memoized Inngest steps.

The public REST API is also usable without the TypeScript SDK.

The current beta lets customers:

- create, list, get, and destroy sandboxes
- request vCPU and memory
- execute a non-interactive command and capture its output
- stream sandbox logs
- upload or download one regular file at a time
- start, list, get, signal, and wait for managed processes
- read retained process output
- tail retained process output and follow new output
- create, list, get, delete, and clone crash-consistent snapshots
- pause a sandbox and resume the same identity later.
- select workspace secrets by exact name for injection into a fresh sandbox.

Sandboxes use a platform-provided image and the workspace's default egress-only VPC. A sandbox and every process inside it are identified by canonical lowercase UUIDs.

**Not Yet Implemented**

The following capabilities are not implemented in the current beta:

- custom images, templates, language runtimes, or OCI images
- public VPC selection or user-defined network policy
- ingress, public URLs, SSH, VNC, browser automation, or port forwarding
- interactive Exec, stdin, PTYs, or terminal resize
- directory listing, recursive file transfer, append, rename, or delete
- durable file storage, process recovery, or output storage
- general runtime and process recovery after a node or runtime restart
- a user-configurable sandbox TTL
- a CLI or MCP server
- live logs, live process output, or file transfer through `step.sandbox`.

Snapshot, clone, Pause, Resume, and launch secret selection are exposed through
REST and both TypeScript SDK surfaces. The Sandbox APIs select existing
workspace secrets; they do not create, list, rotate, or archive secret values.

The remaining items are potential follow-ups, not implied compatibility commitments.

**Starting Questions**

### How does a customer create and use a sandbox?

Call `POST /v2/sandboxes`, `inngest.sandboxes.create()`, or `step.sandbox.create()`. Create returns a full sandbox resource in either `STARTING` or `RUNNING`. Runtime operations require `RUNNING`.

### How does code enter a sandbox?

The beta does not clone repositories or upload directories directly. Customers can:

- upload individual files
- run an executable already in the image by name, absolute path, or a path relative to the working directory
- run a command that downloads or checks out source from the network.

### Which resource configurations are supported?

New sandboxes currently support these exact pairs:

| `vcpu` | `memoryMb` |
| -----: | ---------: |
|      1 |       1024 |
|      2 |       2048 |
|      4 |       4096 |

The public contract exposes `vcpu` and `memoryMb`, not a profile name. Both values must come from the same row. The REST and SDK validators currently enforce only positive unsigned integers; an otherwise valid but unsupported pair cannot be placed and returns `503 compute_unavailable`. Snapshot clones inherit the captured resource configuration.

### Which runtimes are available?

The beta uses one fixed default image. The public API does not expose an image, template, profile, or language-runtime selector.

The current image includes:

- Node.js latest through `node`, `npm`, `npx`, and `corepack`
- Node.js LTS through `node-lts`, `npm-lts`, `npx-lts`, and `corepack-lts`
- Python 3.14 through `python3` and `python`
- Ruby 4.0
- Git, curl, OpenSSH, and CA certificates
- BusyBox `sh`
- common command-line tools including GNU `sed`, `grep`, and `awk`, plus `ripgrep`, `jq`, `findutils`, `diffutils`, `tar`, and `gzip`.

Go, Rust, Java, Bun, and Deno are not installed in the current image. Exact runtime versions may change when the default image is rebuilt.

### Is creating a sandbox different from running a command?

Yes. Create allocates a live isolated runtime. Captured Exec runs one command inside an existing `RUNNING` sandbox. Managed process Start creates a background process inside that sandbox.

### What happens when capacity is unavailable?

The API returns `503 compute_unavailable` when an operation is safe to repeat. This includes failures before dispatch and unconfirmed responses from Create, Destroy, Pause, Resume, snapshot Delete, and file upload. Reads and safe-to-repeat mutations may be retried with bounded backoff.

`409 operation_ambiguous` is not a sandbox or process state. It means an unsafe-to-repeat operation may have completed even though the platform could not confirm its result. Use `SandboxError.action` and the action-specific recovery guidance below.

### How are stdout and stderr returned?

Captured Exec buffers stdout and stderr separately. REST returns base64; the SDK returns UTF-8 strings. Invalid or truncated UTF-8 sequences are represented by the Unicode replacement character.

Managed-process output is stored as ordered stdout/stderr chunks in an in-memory ring. Customers can read the retained ring or open an NDJSON stream that emits the retained tail and then follows new output.

### How are output files returned?

Files are downloaded as `application/octet-stream` response bodies. The beta does not have a declared-artifact abstraction.

### How are sandboxes scoped?

Authentication resolves an Inngest account and workspace. Every lookup also checks both scopes and the sandbox workload type. A resource in another workspace is indistinguishable from a missing resource.

### How is sandbox Create idempotent?

A completed `step.sandbox.create()` replays from its memoized step result. If execution retries before that result is persisted, Create sends the same name and resources and the API returns the same pending, starting, or running sandbox with its stable UUID. The direct `inngest.sandboxes.create()` client receives the same active-name behavior.

This guarantee lasts while the sandbox is active. After archival, the name may create a new sandbox. Other mutations do not inherit Create's active-name protection.

# Implementation

**Research**

The design was informed by:

- Sprites API, including resource-oriented lifecycle, command sessions, checkpoints, files, and network policy
- E2B Sandboxes, including lifecycle, templates, filesystems, foreground commands, and background commands
- Daytona Sandboxes, including snapshots, process execution, files, and log streaming
- Blaxel Sandboxes, including a sandbox-local API for process and file operations
- Vercel Sandbox SDK
- Cloudflare Sandbox SDK.

The beta deliberately implements a smaller surface:

- one stable sandbox resource instead of separate create and runtime models
- an explicit distinction between captured commands and managed processes
- byte-safe REST and durable wire formats, with UTF-8 strings for captured SDK output and raw bytes for streamed chunks
- a direct REST client plus a separate durable middleware surface
- honest ambiguity and retention boundaries instead of implied exactly-once execution or durable logs.

**High level**

```
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

```
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
- REST output and streams preserve arbitrary bytes. The SDK decodes captured Exec stdout and stderr as non-fatal UTF-8 strings; streamed chunks remain `Uint8Array`.
- `operation_ambiguous` is never retried automatically.

### Resource Model

#### Sandbox

```tsx
interface SandboxResource {
  id: string;
  name: string;
  status:
    | "PENDING"
    | "STARTING"
    | "PAUSING"
    | "RUNNING"
    | "PAUSED"
    | "RESUMING"
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

```tsx
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

#### Snapshot

```tsx
interface SandboxSnapshotResource {
  id: string;
  sourceImageId: string;
  status: "CREATING" | "READY" | "DELETING" | "DELETED" | "FAILED" | "LOST";
  compatibilityId?: string;
  resources: {
    vcpu: number;
    memoryMb: number;
  };
  memoryPackCount: number;
  diskPackCount: number;
  storedBytes: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  error?: string;
}
```

`READY` snapshots include `compatibilityId` and an immutable image digest in `sourceImageId`. `error` can be present for a failed snapshot. Every snapshot has a server-defined expiration time.

### Lifecycle

The complete status vocabulary is:

```
PENDING -> STARTING -> RUNNING -> PAUSING -> PAUSED
                 ^                         |
                 +-------- RESUMING <------+

RUNNING -> TERMINATING -> TERMINATED
   \                         /
    +-------> FAILED <------+
```

Pause takes a `RUNNING` sandbox through `PAUSING` to `PAUSED`. Resume takes the same sandbox ID through `RESUMING` back to `RUNNING`. The private pause checkpoint preserves memory, disk, image, resources, environment, and network identity. Time spent paused does not consume the sandbox's remaining runtime.

The Pause and Resume REST responses expose their specific transient states. The generated Get and List response contract currently serializes `PAUSING` and `RESUMING` as the generic transient state `STARTING`; clients must treat it as non-running and poll until the stable target. The TypeScript SDK performs this polling and returns `PAUSED` or `RUNNING`.

Create can reuse an active sandbox and remains honest about readiness:

- HTTP 200 means an identical Create returned the matching active resource.
- HTTP 201 means the returned resource is already `RUNNING`.
- HTTP 202 means the returned resource is `STARTING`.

There is no dedicated readiness endpoint. SDK Create polls Get for up to 120 seconds by default without redispatching Create. Set `runningTimeout: false` to preserve the immediate REST behavior, or pass a duration up to five minutes. `waitUntilRunning()` exposes the same bounded polling separately.

Destroy can return:

- HTTP 202 and a `TERMINATING` resource
- HTTP 204 when teardown completed synchronously.

Destroy removes the guest filesystem, processes, and retained output.

### Authentication and Workspace Selection

REST requests use:

```
Authorization: Bearer <INNGEST_SIGNING_KEY>
```

The signing key selects its workspace by default. `X-Inngest-Env` can target an environment explicitly, including a branch environment that shares its parent signing key.

The TypeScript client uses the credentials, API origin, environment headers, Fetch implementation, and other request headers configured on its `Inngest` instance.

Sandbox clients are server-only. Never put a signing key in a browser bundle.

### REST v2 Conventions

Cloud origin:

```
<https://api.inngest.com>
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

- reject unknown fields
- reject trailing or multiple JSON values
- are capped at 1 MiB for Create, captured Exec, process Start, and Signal.

Errors use:

```json
{
  "errors": [
    {
      "code": "invalid_field_format",
      "message": "command must contain at least one argument"
    }
  ]
}
```

Clients must branch on `code`, not `message`. Live resources and output use `Cache-Control: no-store`.

### Sandbox Management

| Operation       | Method and path                            | Behavior                            |
| --------------- | ------------------------------------------ | ----------------------------------- |
| Create          | `POST /v2/sandboxes`                       | Allocate a sandbox                  |
| List            | `GET /v2/sandboxes?cursor=&limit=`         | List workspace sandboxes            |
| Get             | `GET /v2/sandboxes/{sandboxId}`            | Get current state                   |
| Destroy         | `DELETE /v2/sandboxes/{sandboxId}`         | Begin or observe teardown           |
| Pause           | `POST /v2/sandboxes/{sandboxId}/pause`     | Suspend the same sandbox identity   |
| Resume          | `POST /v2/sandboxes/{sandboxId}/resume`    | Restore the paused sandbox          |
| Captured Exec   | `POST /v2/sandboxes/{sandboxId}/exec`      | Run one command and buffer output   |
| Logs            | `GET /v2/sandboxes/{sandboxId}/logs`       | Stream sandbox logs as NDJSON       |
| Upload file     | `PUT /v2/sandboxes/{sandboxId}/files`      | Atomically replace one regular file |
| Download file   | `GET /v2/sandboxes/{sandboxId}/files`      | Stream one regular file             |
| Create snapshot | `POST /v2/sandboxes/{sandboxId}/snapshots` | Capture memory and disk             |
| List snapshots  | `GET /v2/snapshots`                        | List workspace snapshots            |
| Get snapshot    | `GET /v2/snapshots/{snapshotId}`           | Get current snapshot state          |
| Delete snapshot | `DELETE /v2/snapshots/{snapshotId}`        | Permanently delete a snapshot       |

### Creation Request

```
POST /v2/sandboxes
Authorization: Bearer ...
Content-Type: application/json
```

```json
{
  "name": "agent_job-42",
  "vcpu": 1,
  "memoryMb": 1024,
  "environment": {
    "CI": "true"
  },
  "secrets": ["OPENAI_API_KEY"]
}
```

| Field         | Rules                                                                                |
| ------------- | ------------------------------------------------------------------------------------ |
| `name`        | Required; 1–255 Unicode code points, no control characters or surrounding whitespace |
| `vcpu`        | Required positive unsigned 32-bit integer for a new sandbox                          |
| `memoryMb`    | Required positive unsigned 32-bit integer in MiB for a new sandbox                   |
| `environment` | Optional sandbox-level environment variables                                         |
| `secrets`     | Optional exact workspace secret names for a new sandbox                              |
| `snapshotId`  | Optional READY snapshot UUID to clone                                                |

For a new sandbox, `vcpu` and `memoryMb` must match one of the supported pairs above. There is no `image`, `template`, `profile`, `vpcId`, disk-size, command, or TTL field. When `snapshotId` is supplied, `vcpu` and `memoryMb` can be omitted and otherwise must match the snapshot. The clone restores the captured environment with the source image, memory, and disk; clone requests cannot include `environment` or `secrets`.

`secrets` selects active secrets from the authenticated workspace by exact,
case-sensitive name. Values are injected under the same environment variable
names and inherited by commands and managed processes. Names, not values,
cross the public Create API. Selected names must be unique, valid environment
keys, and disjoint from literal `environment` keys. Selection order does not
affect Create identity.

The names resolve to stable secret identities when the workload is created.
Rotation affects the next authorized fetch, but does not replace a value
already delivered to a guest. Archiving and recreating the same name affects
new sandboxes; existing workloads remain pinned to their original identity.
Pause and Resume do not refetch. User snapshots can capture delivered values,
and clones neither refetch nor accept new secret selection. Sandbox outputs and
files are not automatically redacted.

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
      "vcpu": 1,
      "memoryMb": 1024
    },
    "createdAt": "2026-07-30T12:00:00.123456789Z"
  },
  "metadata": {
    "fetchedAt": "2026-07-30T12:00:00.200000000Z"
  }
}
```

Name uniqueness applies to active resources in the workspace.

Create is idempotent for an active sandbox with the same name and full Create
intent. Secret selection order does not matter, but resolved secret identities
do. Repeating the matching request returns that sandbox instead of creating a
second one. Reusing the name with a conflicting intent returns
`sandbox_name_taken`. This guarantee ends after archival.

### List Sandboxes

```
GET /v2/sandboxes?limit=50&cursor=<opaque>
```

`limit` defaults to 50 and accepts 1–250. Results include retained terminal resources and are ordered by `createdAt DESC`, then `id DESC`.

Pagination is keyset-based. Pass `page.cursor` back unchanged only when `page.hasMore` is true. Do not decode or construct cursors.

The beta has no name, status, image, or VPC filters.

### Get a Sandbox

```
GET /v2/sandboxes/{sandboxId}
```

Get returns the complete current resource. A missing or workspace-hidden sandbox returns `404 sandbox_not_found`.

### Pause and Resume a Sandbox

```
POST /v2/sandboxes/{sandboxId}/pause
POST /v2/sandboxes/{sandboxId}/resume
```

Both requests have no body and return HTTP 200 with the complete current resource. Pause accepts `RUNNING`, `PAUSING`, or `PAUSED`; Resume accepts `PAUSED`, `RESUMING`, or `RUNNING`. Repeating either operation continues or returns the same state-based transition.

Pause creates a private memory-and-disk checkpoint, stops the runtime, and clears its node assignment. The checkpoint is hidden from public snapshot APIs and excluded from user snapshot quotas. Resume restores the same sandbox UUID, name, network identity, image, resources, environment, filesystem, and remaining runtime.

The SDK waits up to five minutes by default for Pause to reach `PAUSED` and Resume to reach `RUNNING`. Direct methods accept an `AbortSignal`; aborting stops observation but does not prove the remote transition was cancelled. Durable methods use stable step IDs and ordinary `step.run` replay semantics.

### Destroy a Sandbox

```
DELETE /v2/sandboxes/{sandboxId}
```

The service persists teardown intent before contacting the node. A successful request returns either the `TERMINATING` resource with HTTP 202 or no body with HTTP 204.

### Captured Exec

```
POST /v2/sandboxes/{sandboxId}/exec
Content-Type: application/json
```

```json
{
  "command": ["/bin/sh", "-c", "printf 'tests passed\n'"],
  "environment": {
    "CI": "true"
  },
  "cwd": "/workspace",
  "timeout": "5m"
}
```

| Field         | Default   | Rules                                             |
| ------------- | --------- | ------------------------------------------------- |
| `command`     | Required  | Argument vector executed directly                 |
| `environment` | Inherited | Overrides sandbox and guest environment variables |
| `cwd`         | `/`       | Working directory                                 |
| `timeout`     | `30s`     | Positive Go duration, maximum `5m`                |

The REST API does not shell-parse `command` or accept a string. Invoke `/bin/sh` or another shell explicitly when shell syntax is required. Bare executable names are resolved with the effective guest `PATH`; values containing `/` are used as supplied and can be relative to `cwd`.

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

```
GET /v2/sandboxes/{sandboxId}/logs?follow=false
Accept: application/x-ndjson
```

`follow` defaults to `false`.

Log frame:

```json
{
  "type": "log",
  "stream": "STDOUT",
  "data": "c3RhcnRlZAo=",
  "encoding": "base64",
  "at": "2026-07-30T12:00:00Z"
}
```

The endpoint opens the upstream stream before committing HTTP 200. Admission failures return an ordinary non-200 JSON error. Live failures after headers use a terminal frame:

```json
{
  "type": "error",
  "errors": [
    {
      "code": "compute_unavailable",
      "message": "Compute is temporarily unavailable"
    }
  ]
}
```

Consumers must parse every frame. HTTP 200 alone does not prove a successful stream. Logs are live runtime output, not durable log storage.

### Files

#### Upload or Replace

```
PUT /v2/sandboxes/{sandboxId}/files?path=/tmp/input.bin&mode=0640
Content-Type: application/octet-stream
```

The request body is the raw file.

| Value | Limit                                      |
| ----- | ------------------------------------------ |
| Path  | Absolute, no NUL, at most 4096 UTF-8 bytes |
| Mode  | Octal `0001`–`0777`; default `0644`        |
| Body  | At most 100 MiB                            |
| Type  | Regular file only                          |

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

Repeating the same upload with the same path, bytes, and mode is safe. Each successful upload atomically replaces the complete destination.

#### Download

```
GET /v2/sandboxes/{sandboxId}/files?path=/tmp/output.bin
```

The response is `application/octet-stream` and includes `Content-Length`, `X-Sandbox-File-Mode`, and, when available, `Last-Modified`.

Only regular files up to 100 MiB are downloadable. A binary stream cannot add a JSON error after HTTP 200, so a body shorter than `Content-Length` is a failed download.

The beta has no list, append, ranged write, delete, rename, directory, symlink, or recursive transfer operation.

### Managed Processes

| Operation        | Method and path                                                     |
| ---------------- | ------------------------------------------------------------------- |
| Start            | `POST /v2/sandboxes/{sandboxId}/processes`                          |
| List             | `GET /v2/sandboxes/{sandboxId}/processes?cursor=&limit=`            |
| Get              | `GET /v2/sandboxes/{sandboxId}/processes/{processId}`               |
| Signal           | `POST /v2/sandboxes/{sandboxId}/processes/{processId}/signals`      |
| Wait             | `POST /v2/sandboxes/{sandboxId}/processes/{processId}/wait`         |
| Retained output  | `GET /v2/sandboxes/{sandboxId}/processes/{processId}/output`        |
| Streaming output | `GET /v2/sandboxes/{sandboxId}/processes/{processId}/output/stream` |

Managed processes are appropriate for servers, workers, watchers, and other commands that must continue after Start returns.

#### Start

```json
{
  "command": ["my-server"],
  "environment": {
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
    "command": ["my-server"],
    "pid": 87,
    "state": "RUNNING"
  },
  "metadata": {
    "fetchedAt": "2026-07-30T12:00:02Z"
  }
}
```

The control plane generates the public UUID before dispatch and passes it to the node. Guest-generated handles are filtered out.

Process command and environment behavior matches captured Exec: REST accepts an argv array, resolves bare executables through the effective guest `PATH`, and layers process-specific environment values over sandbox and guest values.

Start has no HTTP idempotency key. `operation_ambiguous` means a process may be running even though its UUID and PID did not reach the caller. This is an error about the outcome of Start, not a process state. Do not call Start again automatically. List processes and compare command and start time. If the process cannot be identified confidently, require application-level or operator reconciliation.

#### List and Get

List returns processes sorted by UUID. `limit` defaults to 50 and is capped at 250. Pagination cursors are opaque.

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

Signal is a mutation. `operation_ambiguous` means the signal may have been delivered even though its response was lost. Get or wait for the process before deciding what to do next. Send another signal only when duplicate delivery is safe for that signal and application.

Current beta limitation: use `includeChildren: true` only with signal 9 (`SIGKILL`). Non-SIGKILL descendant delivery cannot be made race-free and can leave terminal state unobservable.

#### Wait

```
POST /v2/sandboxes/{sandboxId}/processes/{processId}/wait?timeout=30s
```

Wait has no body. `timeout` defaults to 30 seconds and is capped at five minutes.

Wait returns a terminal state. A `504 sandbox_process_wait_timed_out` response ends only the observation. It does not stop or signal the process, and waiting again is safe.

There is no process runtime timeout. Applications must signal processes they no longer need.

#### Retained Output

```
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

```
404 sandbox_process_not_found
404 sandbox_process_output_not_retained
```

The second code means the process metadata still exists but its output ring was evicted.

#### Streaming Output

```
GET /v2/sandboxes/{sandboxId}/processes/{processId}/output/stream?tailBytes=8192
Accept: application/x-ndjson
```

The stream always emits the retained tail and then follows live output. There is no `follow` option.

Admission failures return a normal non-200 JSON error before headers. A failure after HTTP 200 sends the same terminal `errors` frame used by sandbox logs.

The stream is best effort:

- a slow consumer can miss chunks
- frames have no sequence number, resume token, or loss marker
- the SDK never reconnects automatically
- manually reconnecting can replay retained chunks and create duplicates.

#### Output Retention

- Each process ring retains approximately 512 KiB across stdout and stderr.
- Only the newest 32 process rings are retained.
- Starting more processes can evict an older ring while metadata remains.
- Output is memory-only and disappears with the sandbox.

Persist important results to a file or external store.

### Snapshots and Cloning

Snapshots are durable, crash-consistent captures of a running sandbox's memory and disk. REST, `inngest.sandboxes`, and `step.sandbox` expose the same resource and lifecycle in Inngest SDK 4.20 or newer.

| Operation       | Method and path                                   |
| --------------- | ------------------------------------------------- |
| Create snapshot | `POST /v2/sandboxes/{sandboxId}/snapshots`        |
| List snapshots  | `GET /v2/snapshots?cursor=&limit=`                |
| Get snapshot    | `GET /v2/snapshots/{snapshotId}`                  |
| Delete snapshot | `DELETE /v2/snapshots/{snapshotId}`               |
| Clone snapshot  | `POST /v2/sandboxes` with `name` and `snapshotId` |

Create snapshot accepts an empty body or `{}`, rejects unknown fields, and caps the body at 4 KiB. It returns HTTP 202 with `CREATING`. The node safely records the local capture and upload job before returning, then uploads the portable artifact in the background. The source sandbox must be `RUNNING`; it is briefly paused for the crash-consistent capture and then continues running. Snapshot Create has no idempotency key; reconcile List after an uncertain response instead of repeating it blindly.

Snapshot states are `CREATING`, `READY`, `DELETING`, `DELETED`, `FAILED`, and `LOST`. Resources include the source image ID, vCPU and memory, memory and disk pack counts, stored bytes, timestamps, `expiresAt`, and an optional error. `READY` resources also include `compatibilityId`. Captures are crash-consistent even though consistency is not a separate response field.

List is workspace-scoped, ordered by `createdAt DESC` and `id DESC`, and uses the standard opaque cursor with a default of 50 and maximum of 250 items.

A clone must reference a `READY` snapshot. Omitted `vcpu` and `memoryMb` inherit the captured values; supplied values must match. The clone restores the source image, environment, memory, and disk, and a requested `environment` does not override the captured values. The cloned sandbox gets a new UUID and follows normal Create response and active-name idempotency behavior.

Snapshot count and stored-byte limits are account-specific. Exceeding either returns `sandbox_snapshot_limit_exceeded`. Delete returns HTTP 204 and is permanent.

The direct SDK surface is:

```tsx
const snapshot = await sandbox.snapshot({}, { timeout: "5m" });
const clone = await snapshot.clone({
  name: "prepared-copy",
  runningTimeout: "2m",
});

const page = await inngest.sandboxes.snapshots.list({ limit: 50 });
const current = await inngest.sandboxes.snapshots.get(snapshot.id);

await current?.delete();
```

Snapshot creation and clone startup use separate waits. `sandbox.snapshot()` dispatches Create once, then polls Get from the current SDK invocation until the snapshot is `READY`. The readiness deadline defaults to and is capped at five minutes; it begins after Create returns. A timeout stops observation but does not cancel snapshot creation or its background upload.

After the snapshot is ready, `snapshot.clone()` uses normal sandbox Create behavior. A fresh clone returned as `RUNNING` resolves immediately. If Create returns `STARTING`, the SDK waits up to `runningTimeout`, which defaults to 120 seconds, for the new sandbox to become `RUNNING`.

The durable surface adds stable step IDs:

```tsx
const snapshot = await sandbox.snapshot(
  "create-snapshot",
  {},
  { timeout: "5m" },
);
const clone = await snapshot.clone("clone-snapshot", {
  name: "prepared-copy",
});

const page = await step.sandbox.snapshots.list("list-snapshots", {
  limit: 50,
});
const current = await step.sandbox.snapshots.get(
  "get-snapshot",
  snapshot.id,
);

await current?.waitUntilReady("wait-for-snapshot", { timeout: "5m" });
await snapshot.delete("delete-snapshot");
```

`sandbox.snapshots.create(...)` is a durable alias for `sandbox.snapshot(...)`. Snapshot Create and its readiness wait are separate memoized steps, so replaying or retrying the safe readiness observation does not create another snapshot. The readiness step polls while the current SDK invocation remains active; it is not an executor-owned sleep or notification. An `operation_ambiguous` Create is non-retryable because repeating it can create a second snapshot; reconcile the workspace snapshot list first.

### Error Model

| HTTP | Code                                  | Meaning                                                                    | Retry guidance                                    |
| ---- | ------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| 400  | `invalid_request`                     | Invalid JSON or unknown fields                                             | Fix request                                       |
| 400  | `missing_field`                       | Required field missing                                                     | Fix request                                       |
| 400  | `invalid_field_format`                | Invalid ID, command, signal, duration, cursor, path, mode, or tail         | Fix request                                       |
| 401  | `authorization_header_missing`        | Missing credentials                                                        | Fix credentials                                   |
| 401  | `invalid_api_key`                     | Invalid credentials                                                        | Rotate or replace                                 |
| 403  | `access_denied`                       | Beta not enabled                                                           | Request access                                    |
| 403  | `sandbox_snapshot_limit_exceeded`     | Snapshot count or stored-byte quota reached                                | Delete snapshots or request capacity              |
| 404  | `sandbox_not_found`                   | Sandbox missing or hidden                                                  | Reconcile target                                  |
| 404  | `sandbox_file_not_found`              | File or sandbox missing                                                    | Reconcile target                                  |
| 404  | `sandbox_process_not_found`           | Process missing                                                            | Reconcile target                                  |
| 404  | `sandbox_process_output_not_retained` | Output ring evicted                                                        | Cannot recover from this API                      |
| 404  | `sandbox_snapshot_not_found`          | Snapshot missing or hidden                                                 | Reconcile target                                  |
| 409  | `sandbox_name_taken`                  | Active name already exists                                                 | Choose or inspect name                            |
| 409  | `sandbox_snapshot_not_ready`          | Snapshot is not ready for the operation                                    | Poll or inspect terminal state                    |
| 409  | `invalid_request`                     | Resource not in required state                                             | Get current state                                 |
| 409  | `operation_ambiguous`                 | The result of the operation identified by `SandboxError.action` is unknown | Follow the action-specific recovery guidance      |
| 413  | `sandbox_exec_output_too_large`       | Captured output exceeded 4 MiB                                             | Command may have run                              |
| 413  | `sandbox_file_too_large`              | File exceeded 100 MiB                                                      | Reduce or split                                   |
| 429  | `rate_limited`                        | Rejected by rate limit                                                     | Retry safe operations with backoff                |
| 500  | `internal_error`                      | Unexpected failure                                                         | Retry only when proven safe                       |
| 503  | `compute_unavailable`                 | Operation was rejected before dispatch or is safe to repeat                | Safe reads and safe-to-repeat mutations may retry |
| 504  | `sandbox_exec_timed_out`              | Exec observation timed out                                                 | Command may have run                              |
| 504  | `sandbox_process_wait_timed_out`      | Wait observation timed out                                                 | Waiting again is safe                             |

Safe reads include List, Get, Wait, retained output, streams, file download, and snapshot List and Get.

Mutations do not all have the same retry behavior. Repeating the same Create request recovers the matching active sandbox, Pause and Resume continue their state-based transitions, Destroy records teardown intent before contacting the node, snapshot Delete is safe to repeat after a transport failure, and repeating the same file upload produces the same destination. Captured Exec, process Start, arbitrary process Signal, and snapshot Create can produce another side effect when repeated.

A non-idempotent mutation may retry only when the service proves rejection before dispatch. A missing response is not proof.

### Validation Limits

#### Sandbox

| Value             | Limit                                                                      |
| ----------------- | -------------------------------------------------------------------------- |
| Name              | 1–255 Unicode code points; no control characters or surrounding whitespace |
| Resource configuration | Exact pair: `1`/`1024`, `2`/`2048`, or `4`/`4096` (`vcpu`/`memoryMb`) |
| Secret name       | 1–256 UTF-8 bytes; no surrounding Unicode whitespace, `=`, CR, LF, or NUL |
| Literal environment keys plus secrets | Maximum 256 entries and 64 KiB of resolved `KEY=value` data |
| Sandbox List page | Default 50, maximum 250                                                    |
| Create body       | 1 MiB                                                                      |

The REST and SDK validators accept positive unsigned integers, but placement requires one of the exact resource pairs above. Other pairs return `503 compute_unavailable`. Entitlements and available capacity can still reject a supported pair.

#### Commands and Process Start

| Value                               | Limit  |
| ----------------------------------- | ------ |
| Argument count                      | 1–128  |
| Total argument UTF-8 bytes          | 32 KiB |
| Environment entries                 | 256    |
| Total environment `KEY=value` bytes | 64 KiB |
| Working-directory UTF-8 bytes       | 4096   |
| Encoded process specification       | 96 KiB |
| JSON body                           | 1 MiB  |

Arguments, environment keys and values, and `cwd` cannot contain NUL. Environment keys must be non-empty and cannot contain `=`. Bare executables are resolved through the effective guest `PATH`; executable paths containing `/` are used as supplied and can be relative to `cwd`. Operation-specific environment values override sandbox values, which override guest defaults.

#### Time and Output

| Value                            | Limit                 |
| -------------------------------- | --------------------- |
| Captured Exec default timeout    | 30 seconds            |
| Captured Exec maximum timeout    | 5 minutes             |
| Direct captured stdout + stderr  | 4 MiB                 |
| Durable retained stdout + stderr | 2 MiB                 |
| Process Wait default             | 30 seconds            |
| Process Wait maximum             | 5 minutes             |
| Retained process output          | Approximately 512 KiB |
| Retained process rings           | Newest 32             |
| `tailBytes`                      | 0–524,288             |

## TypeScript SDK

### Installation

```bash
npm install inngest@latest
```

### Client Setup

```tsx
import { Inngest } from "inngest";
import { sandboxMiddleware } from "inngest/experimental";

export const inngest = new Inngest({
  id: "sandbox-beta-demo",
  middleware: [sandboxMiddleware()],
});
```

The middleware enables `step.sandbox`. The direct `inngest.sandboxes` client does not require it.

The SDK needs a server-side signing key. The client reads the standard Inngest environment configuration.

### Choose a Surface

| Capability                             | `inngest.sandboxes` | `step.sandbox` |
| -------------------------------------- | ------------------- | -------------- |
| Create, List, Get, Destroy             | Yes                 | Yes            |
| Pause and Resume                       | Yes                 | Yes            |
| Snapshot Create, List, Get, Delete, Clone | Yes              | Yes            |
| Captured Exec                          | Yes                 | Yes            |
| Process Start, List, Get, Signal, Wait | Yes                 | Yes            |
| Retained process output                | Yes                 | Yes            |
| Sandbox logs                           | Yes                 | No             |
| Live process output                    | Yes                 | No             |
| File upload and download               | Yes                 | No             |

Use `inngest.sandboxes` from server routes, workers, scripts, or other code that owns its request lifecycle.

Use `step.sandbox` inside an Inngest function when the operation and its result should be memoized as a step.

### Direct Getting Started

```tsx
import type { Sandbox } from "inngest/experimental";
import { inngest } from "./client";

let sandbox: Sandbox | undefined;

try {
  sandbox = await inngest.sandboxes.create({
    name: `beta-${crypto.randomUUID()}`,
    vcpu: 1,
    memoryMb: 1024,
    environment: { CI: "true" },
  });

  const result = await sandbox.commands.run(
    "printf 'hello from the sandbox\n'",
    {
      cwd: "/",
      timeout: "30s",
    }
  );

  console.log(result.stdout);
  console.log(result.exitCode);
} finally {
  await sandbox?.destroy();
}
```

The direct client does not retry individual operations automatically. Omitted `runningTimeout` performs up to 120 seconds of readiness polling and never repeats Create; `false` returns immediately. The caller owns other retry policy, cancellation, and cleanup.

### Durable Getting Started

```tsx
import { inngest } from "./client";

export const runInSandbox = inngest.createFunction(
  {
    id: "run-in-sandbox",
    triggers: [{ event: "sandbox/demo.requested" }],
  },
  async ({ event, step }) => {
    const sandbox = await step.sandbox.create("create-sandbox", {
      name: `beta-${event.data.jobId}`,
      vcpu: 1,
      memoryMb: 1024,
    });

    const result = await sandbox.commands.run(
      "run-command",
      "printf 'hello from a durable step\n'",
      { timeout: "30s" }
    );

    await sandbox.destroy("destroy-sandbox");

    return {
      sandboxId: sandbox.id,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      outputWasTruncated: result.output.truncated,
    };
  }
);
```

Every durable operation requires a stable, unique step ID. Let unexpected errors escape so Inngest can apply the SDK's retry classification. Catch an error only when implementing an intentional fallback or compensation path.

Destroy on the success path does not run after a permanently failed function. Use an Inngest failure handler or external cleanup policy when leaked sandboxes are unacceptable.

### List Sandboxes

Direct:

```tsx
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

```tsx
const page = await step.sandbox.list("list-sandboxes", { limit: 50 });
```

### Pause and Resume

Direct:

```tsx
const paused = await sandbox.pause({ timeout: "5m" });
const running = await paused.resume({ timeout: "5m" });
```

Durable:

```tsx
const paused = await sandbox.pause("pause-sandbox", { timeout: "5m" });
const running = await paused.resume("resume-sandbox", { timeout: "5m" });
```

Both methods wait for the stable target state and return a new immutable facade. The default and maximum wait is five minutes. Pause and Resume preserve the same sandbox identity; user snapshot Clone creates a new identity.

### Captured Commands

Direct:

```tsx
const result = await sandbox.commands.run("node --version", {
  cwd: "/workspace",
  timeout: "30s",
});
```

Durable:

```tsx
const result = await sandbox.commands.run("node-version", [
  "node",
  "--version",
]);
```

`stdout` and `stderr` are UTF-8 strings. Invalid or truncated byte sequences are represented by the Unicode replacement character.

SDK command strings run exactly as `["/bin/sh", "-c", command]`. Arrays bypass the shell. In both forms, bare executables use the guest `PATH` and paths containing `/` are used as supplied.

Direct results contain at most 4 MiB and report:

```tsx
result.output; // { truncated: false }
```

The durable middleware retains at most 2 MiB so the JSON-safe, base64-encoded step result fits the executor output limit. Larger successful results keep deterministic tails:

```tsx
if (result.output.truncated) {
  console.log(result.output.strategy); // "tail"
  console.log(result.output.originalBytes);
  console.log(result.output.retainedBytes);
}
```

### Managed Processes

Direct:

```tsx
let worker = await sandbox.processes.start({
  command: "printf 'worker started\n'; exec sleep 30",
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

```tsx
let worker = await sandbox.processes.start("start-worker", {
  command: "exec sleep 30",
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

```tsx
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

```tsx
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

```tsx
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

```tsx
class SandboxError extends Error {
  action: SandboxAction;
  code: SandboxErrorCode;
  status?: number;
  sandboxId?: string;
  processId?: string;
  snapshotId?: string;
  ambiguous: boolean;
  retryable: boolean;
  requestId?: string;
  details: readonly Record<string, unknown>[];
  cause?: unknown;
}
```

Invalid local input and malformed server responses throw `SandboxValidationError`.

`SandboxError.action` always identifies the attempted operation. Use `action`, `code`, `ambiguous`, and `retryable` for control flow. Messages are human-readable and may change.

For `operation_ambiguous`, recover according to `action`:

- `exec`: The command may have run, but its captured result was not confirmed. Inspect external effects or an application-defined completion marker. Do not run it again automatically.
- `process.start`: A process may be running, but its generated UUID may not have reached the caller. List processes and compare command and start time. If it cannot be identified confidently, require application-level or operator reconciliation.
- `process.signal`: The signal may have been delivered. Get or wait for the process. Send another signal only when duplicate delivery is safe for that signal and application.
- `snapshot.create`: A snapshot may be creating, but its UUID may not have reached the caller. List recent snapshots and reconcile before creating another.

Create, Destroy, Pause, Resume, snapshot Delete, and file upload are safe to repeat when their responses are unconfirmed. The SDK reports those failures as retryable `compute_unavailable` errors instead of `operation_ambiguous`.

`sandbox_exec_output_too_large` and `sandbox_exec_timed_out` use more specific codes, but they are also ambiguous because the command may have run without a complete observed result.

The direct client never retries, even when `retryable` is true.

The middleware maps:

- retryable `SandboxError` to an ordinary retriable step error
- non-retryable `SandboxError` to `NonRetriableError`
- `SandboxValidationError` to `NonRetriableError`

This classification does not make mutations exactly once.

### Cleanup

The caller owns cleanup.

- Direct code should use `finally`.
- An Inngest function should destroy on its normal success path.
- A function that can fail permanently should use an `onFailure` cleanup strategy or an external reaper.
- Cleanup must tolerate a sandbox that is already terminating, terminal, or missing.

**Alternatives**

### Executor-Owned Sandbox Opcodes

An executor opcode can provide stronger mutation dispatch fencing than ordinary `step.run`, but it requires coordinated SDK and executor rollout. The current beta uses middleware and the public REST API so it can ship and iterate independently.

Stronger persisted fencing remains desirable for captured Exec, Start, and Signal. Create's active-name reuse narrows its duplicate-launch window but is not permanent idempotency; Destroy and identical file replacement are already safe to repeat.

### Full Filesystem API

A large filesystem surface is convenient but increases security, streaming, and atomicity complexity. The beta starts with whole-file upload and download.

### Snapshot Clone vs Pause and Resume

User snapshots and private pause checkpoints intentionally serve different identity models. Clone creates a new named sandbox from a reusable, workspace-visible snapshot. Resume restores the original sandbox ID from a hidden checkpoint and cleans that checkpoint up after the transition. Combining them would either expose private lifecycle state or make clone identity ambiguous.

**Risks & Assumptions**

- Guest defaults are inherited by the sandbox. Literal environment and
  selected secret values are sandbox-level values; command or process values
  override matching keys for that operation.
- Any guest code can read selected secrets. Output, files, and snapshots are
  not automatically scrubbed, and rotation cannot revoke already-delivered
  values.
- In the middleware-backed durable surface, a function crash after an unsafe mutation succeeds but before its step result is persisted can cause that mutation to run again.
- An ambiguous process Start can leave a running process whose generated UUID was not returned to the caller.
- Pause is a cold checkpoint, not application-coordinated quiescing. External network sessions can be interrupted across the transition.
- A paused sandbox is a live lifecycle resource, not permanent archival storage.

**Security Impact**

- The APIs require server-side credentials and scope sandbox access to the authenticated account and workspace.
- Sandboxes execute in isolated Linux guests, separate from the caller's processes and filesystem.
- Sandboxes use the workspace's default egress-only network. Custom network selection and ingress are not exposed.
- Secret values are envelope-encrypted at rest and retrieved through
  short-lived, workload-scoped authorization. Values are not returned by the
  management or Sandbox APIs and are not stored in workload metadata.
- Secret injection makes the value available to guest code. User snapshots can
  retain delivered values, and returned output is not automatically redacted.

**Unknowns & Open Questions**

### Near-Term API Decisions

- Should REST expose a discoverable resource-configuration catalog and reject unsupported pairs before placement instead of returning `compute_unavailable`?
- What sandbox lifetime and concurrency limits will be documented and priced?
- Should sandbox and process List gain additive status or name filters?
- Should process Start expose an application-provided idempotency key?
- Should process streams add sequence numbers, dropped-chunk metadata, or a resume token?
- What automatic cleanup or reaper guarantees are required for beta users?

### Potential Follow-Ups

- custom images, templates, and locked dependency environments
- ingress and authenticated public services
- network policy and customer-selectable VPCs
- durable artifacts and recursive file transfer
- interactive terminal and Exec
- CLI and MCP wrappers
- TypeScript, Python, and Go convenience layers
- runtime recovery and lifecycle reconciliation
- durable processes and output

**Rollout plan**

### Rollout

1. Keep the REST API entitlement-gated.
2. Collect API, naming, readiness, retry, output, and cleanup feedback
3. Resolve high-risk ambiguity, cleanup, and signalling issues
4. Publish a normal SDK version when the contract is ready for a compatibility commitment
5. Expand entitlements gradually while monitoring capacity and failure rates

Pricing, resource quotas, and general-availability SLOs are not defined by this spec.
