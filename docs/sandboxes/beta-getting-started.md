> **This is an early, experimental beta.** The API is access-gated, and the contract can change without a compatibility period. Use it for evaluation and feedback—not production workloads or data you cannot recreate.

Inngest Sandboxes give server-side code and Inngest functions an isolated Linux environment where they can:

- run commands and capture stdout, stderr, and exit codes
- upload and download files
- start and manage background processes
- read retained output or follow live output streams
- capture reusable snapshots and clone them into new sandboxes
- pause a sandbox and resume the same environment later
- select existing workspace secrets by name when creating a sandbox

## Before you start

You need:

1. A Node.js 20 or newer server runtime with the standard Fetch API.
2. An Inngest account and environment with Sandbox beta access enabled.
3. Your environment's Inngest signing key in `INNGEST_SIGNING_KEY`.
4. A server-side project. Do not use the Sandbox client in a browser.

Sandbox access is currently enabled manually. If Create returns `403 access_denied`, ask the Inngest team to enable the beta for your environment.

### Default image

The fixed beta image includes Node.js latest (`node`, `npm`, `npx`) and LTS (`node-lts`, `npm-lts`, `npx-lts`), Python 3.14, Ruby 4.0, Git, curl, OpenSSH, CA certificates, BusyBox `sh`, and common tools such as `grep`, `sed`, `awk`, `ripgrep`, `jq`, `find`, `tar`, and `gzip`. Go, Rust, Java, Bun, and Deno are not currently installed, and custom image or runtime selection is not available.

### Supported sandbox sizes

New sandboxes must use one of these exact resource configurations:

| `vcpu` | `memoryMb` |
| -----: | ---------: |
|      1 |       1024 |
|      2 |       2048 |
|      4 |       4096 |

Choose both values from the same row. The API does not accept a profile name. A sandbox cloned from a snapshot inherits the snapshot's resource configuration.

## 1. Install the SDK

Install Inngest 4.20.0 or newer:

```bash
npm install inngest@latest
```

## 2. Create an Inngest client

Create one shared client:

```tsx
// inngest/client.ts
import { Inngest } from "inngest";
import { sandboxMiddleware } from "inngest/experimental";

export const inngest = new Inngest({
  id: "sandbox-beta-demo",
  middleware: [sandboxMiddleware()],
});
```

The client reads `INNGEST_SIGNING_KEY` automatically. Its configured API base URL, environment, headers, and Fetch implementation also apply to Sandbox requests.

The middleware enables the durable `step.sandbox` surface. The direct `inngest.sandboxes` client does not require middleware, but using one shared configured client keeps both examples working.

## 3. Run a sandbox command in an Inngest function

Use `step.sandbox` when sandbox work is part of a durable Inngest function. Every operation takes a stable step ID.

```tsx
// inngest/functions/run-in-sandbox.ts
import { inngest } from "../client";

export const runInSandbox = inngest.createFunction(
  {
    id: "run-in-sandbox",
    triggers: { event: "sandbox/demo.requested" },
  },
  async ({ event, step }) => {
    const sandbox = await step.sandbox.create("create-sandbox", {
      name: `beta-${event.data.jobId}`,
      vcpu: 1,
      memoryMb: 1024,
      runningTimeout: "60s",
    });

    const result = await sandbox.commands.run(
      "run-command",
      "printf 'hello from the sandbox\n'; printf 'diagnostic\n' >&2",
      {
        cwd: "/",
        timeout: "30s",
      }
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

`step.sandbox.create()` returns a Sandbox object on both fresh execution and replay. You do not need to serialize or reconstruct it manually. Create waits up to 120 seconds for `RUNNING` by default. Set `runningTimeout` to another duration to override the bound, or to `false` to return immediately with `STARTING` or `RUNNING`. Waiting never repeats Create and does not destroy the sandbox if readiness times out.

When you need the sandbox ID before waiting—for example, to guarantee cleanup after a readiness timeout—use the explicit durable helper:

```ts
const sandbox = await step.sandbox.create("create-sandbox", {
  ...options,
  runningTimeout: false,
});

const running = await sandbox.waitUntilRunning("wait-for-sandbox", {
  timeout: "60s",
});
```

Send an event with a sandbox-safe, stable job ID:

```json
{
  "name": "sandbox/demo.requested",
  "data": {
    "jobId": "job_123"
  }
}
```

Let unexpected `step.sandbox` errors escape the function. Inngest retries errors that are safe to retry and records non-retryable or exhausted failures. Catch a failed step only when you are deliberately implementing a fallback or compensation path.

The example destroys the sandbox on the successful path. For real workflows, add an Inngest `onFailure` handler when a permanently failed function must also clean up its sandbox.

## 4. Use a sandbox directly

Use `inngest.sandboxes` from an API route, worker, server action, or script when the current process should make the request immediately.

The direct client is not durable. Individual operations are not retried automatically, but `waitUntilRunning()` performs bounded readiness polling and tolerates retryable Get failures until its deadline. It never repeats Create. Your code still owns cancellation and cleanup.

```tsx
import type { Sandbox } from "inngest/experimental";
import { inngest } from "./inngest/client";

let sandbox: Sandbox | undefined;

try {
  sandbox = await inngest.sandboxes.create({
    name: `beta-direct-${crypto.randomUUID()}`,
    vcpu: 1,
    memoryMb: 1024,
  });

  const result = await sandbox.commands.run(
    "printf 'hello from a direct client\n'",
    {
      timeout: "30s",
    }
  );

  console.log(result.stdout);
} finally {
  await sandbox?.destroy();
}
```

The returned Sandbox object is an immutable view of the state observed by that request. `waitUntilRunning()` and Get return a new object with current state; they do not mutate the original object.

When work needs to reconnect later, store only `sandbox.id` and call `inngest.sandboxes.get(sandboxId)` or `step.sandbox.get("get-sandbox", sandboxId)`. There is no manual attach or serialization step.

## 5. Start and manage a background process

Use a managed process for a server, watcher, worker, or command that should keep running after Start returns. The following examples assume `sandbox` is a `RUNNING` sandbox that has not been destroyed:

```tsx
let worker = await sandbox.processes.start({
  command: "printf 'worker started\n'; exec sleep 30",
  cwd: "/",
});

console.log(worker.id); // Public UUID
console.log(worker.pid); // PID inside the sandbox
console.log(worker.state); // "RUNNING"

const retained = await worker.getOutput({
  tailBytes: 64 * 1024,
});

for (const chunk of retained.chunks) {
  console.log(chunk.stream, new TextDecoder().decode(chunk.data));
}

await worker.signal({
  signal: 9,
  includeChildren: true,
});

worker = await worker.wait({ timeout: "30s" });
console.log(worker.state); // "KILLED"
console.log(worker.terminationSignal); // 9
```

Inside an Inngest function, add a stable step ID to every call:

```tsx
let worker = await sandbox.processes.start("start-worker", {
  command: "exec sleep 30",
  cwd: "/",
});

const retained = await worker.getOutput("read-worker-output", {
  tailBytes: 64 * 1024,
});

await worker.signal("stop-worker", {
  signal: 9,
  includeChildren: true,
});

worker = await worker.wait("wait-for-worker", {
  timeout: "30s",
});
```

Process IDs are public UUIDs. Internal runtime handles such as `p1` and `p2` are never exposed.

## 6. Upload and download a file

Files are available on a `RUNNING` direct-client sandbox:

```tsx
await sandbox.files.upload({
  path: "/tmp/input.txt",
  data: "hello from the host\n",
  mode: 0o640,
});

const response = await sandbox.files.download({
  path: "/tmp/input.txt",
});

console.log(await response.text());
```

Uploads replace one complete regular file. The beta does not provide directory listing, append, delete, rename, recursive transfer, or symlink APIs.

## 7. Follow live process output

Live streams are also direct-client only. This example starts its own process, stops reading after a known marker, and then cleans up the process:

```tsx
let streamingWorker = await sandbox.processes.start({
  command: "sleep 1; printf 'stream complete\n'; exec sleep 30",
  cwd: "/",
});

const stream = await streamingWorker.streamOutput({
  tailBytes: 8 * 1024,
});

const reader = stream.getReader();
const decoder = new TextDecoder();
let stdout = "";

try {
  while (!stdout.includes("stream complete")) {
    const { done, value } = await reader.read();
    if (done) break;

    if (value.stream === "STDOUT") {
      const text = decoder.decode(value.data, { stream: true });
      stdout += text;
      console.log(text);
    }
  }
} finally {
  await reader.cancel();

  await streamingWorker.signal({
    signal: 9,
    includeChildren: true,
  });
  streamingWorker = await streamingWorker.wait({ timeout: "30s" });
}

console.log(streamingWorker.state); // "KILLED"
```

The stream emits the currently retained tail and then follows new output. It does not reconnect automatically. Cancelling the stream aborts the request.

## 8. Snapshot and clone a prepared sandbox

A user snapshot captures memory, disk, environment, image, and resources. The source sandbox keeps running, and each clone gets a new sandbox UUID.

Snapshot creation and clone startup are separate phases. The REST API accepts snapshot creation with `202 CREATING` while the snapshot artifact finishes uploading in the background. `sandbox.snapshot()` polls Get from the current SDK invocation and returns only after the snapshot becomes `READY`, waiting up to five minutes by default. A timeout stops waiting but does not cancel snapshot creation; use snapshot List or Get to inspect it later.

After the snapshot is ready, `snapshot.clone()` uses normal sandbox Create behavior. A clone returned as `RUNNING` resolves immediately. If Create returns `STARTING`, the SDK waits up to 120 seconds for that new sandbox to become `RUNNING` by default:

```tsx
const snapshot = await sandbox.snapshot({}, { timeout: "5m" });

console.log(snapshot.status); // "READY"

const clone = await snapshot.clone({
  name: `beta-clone-${crypto.randomUUID()}`,
  runningTimeout: "2m",
});

console.log(clone.status); // "RUNNING"

await clone.destroy();
await snapshot.delete();
```

Inside an Inngest function, add stable step IDs. Snapshot Create and the readiness wait are separate memoized steps:

```tsx
const snapshot = await sandbox.snapshot(
  "snapshot-sandbox",
  {},
  { timeout: "5m" },
);

const clone = await snapshot.clone("clone-snapshot", {
  name: `beta-clone-${event.data.jobId}`,
  runningTimeout: "2m",
});

await clone.destroy("destroy-clone");
await snapshot.delete("delete-snapshot");
```

Use `inngest.sandboxes.snapshots.list()` or `step.sandbox.snapshots.list()` to find workspace snapshots. A snapshot has a server-defined `expiresAt`; it is not permanent storage.

## 9. Pause and resume the same sandbox

Pause uses a private checkpoint and releases the live runtime. Resume restores the same sandbox ID, network identity, filesystem, memory, resources, environment, and remaining runtime:

```tsx
const paused = await sandbox.pause({ timeout: "5m" });

console.log(paused.id === sandbox.id); // true
console.log(paused.status); // "PAUSED"

const running = await paused.resume({ timeout: "5m" });

console.log(running.id === sandbox.id); // true
console.log(running.status); // "RUNNING"
```

In an Inngest function:

```tsx
const paused = await sandbox.pause("pause-sandbox", { timeout: "5m" });
const running = await paused.resume("resume-sandbox", { timeout: "5m" });
```

Time spent paused does not consume the sandbox's remaining runtime. Commands, files, logs, and process operations require `RUNNING`, so use the Sandbox returned by Resume before continuing.

A user snapshot and Pause solve different problems: snapshot cloning creates a new sandbox ID, while Pause and Resume preserve the original sandbox. Private pause checkpoints are not returned by snapshot List and do not use user snapshot quota.

## Which client should I use?

| Capability                                       | `inngest.sandboxes` | `step.sandbox` |
| ------------------------------------------------ | ------------------- | -------------- |
| Create, List, Get, and Destroy                   | Yes                 | Yes            |
| Pause and Resume                                 | Yes                 | Yes            |
| Snapshot Create, List, Get, Delete, and Clone    | Yes                 | Yes            |
| Captured commands                                | Yes                 | Yes            |
| Start, List, Get, Signal, and Wait for processes | Yes                 | Yes            |
| Retained process output                          | Yes                 | Yes            |
| Live sandbox logs                                | Yes                 | No             |
| Live process output                              | Yes                 | No             |
| File upload and download                         | Yes                 | No             |

Use `step.sandbox` for operations that belong to an Inngest function and should be memoized as steps. Use `inngest.sandboxes` when you need an immediate server-side client, live streams, or file bodies.

## Important beta caveats

### The contract is unstable

Sandboxes remain an experimental surface in the released SDK. Method names, types, limits, error codes, and behavior can change while the beta is access-gated.

### Access and capacity are gated

The public API is cloud-only and entitlement-gated. CPU and memory must match one of the exact supported configurations above. A supported configuration can still be rejected when the account is not entitled to it or no matching capacity is available.

### Configuration is intentionally limited

Create uses the workspace's default egress-only VPC, default image, and current platform policy. The beta does not expose custom VPCs, images, templates, disk sizes, resizing, or a user-configurable TTL. Snapshots, cloning, Pause, and Resume are available through both SDK surfaces in `inngest@4.20.0` or newer.

### Snapshots and Pause are not durable storage

User snapshots are crash-consistent, expire at a server-defined time, and use account-specific count and storage quotas. Snapshot Create has no idempotency key; after `operation_ambiguous`, list recent snapshots before creating another.

Pause is a cold asynchronous transition, not application-coordinated quiescing or live migration. A paused sandbox remains a beta lifecycle resource. Persist anything that must survive independently of the sandbox in external storage.

### Sandboxes and processes are live resources

Durable steps memoize operation results; they do not make the sandbox, guest process, filesystem, or output durable. Process metadata and output are held in memory and disappear when the sandbox is destroyed. Runtime loss can also lose a process without recovery.

### Commands have strict semantics

- A command string runs unchanged through `["/bin/sh", "-c", command]`, so shell quoting, variables, pipes, redirects, and chaining work normally.
- An argv array bypasses the shell. Bare executable names use `PATH`; paths containing `/` are resolved from `cwd` when relative.
- Guest defaults are retained. Sandbox-level environment values override those defaults, and command or process values override matching sandbox values.
- Put ordinary configuration in `environment`. Select credentials through the
  Create `secrets` array; never put secret values directly in the request.
- Selected secrets are readable by guest code, and output, files, and snapshots
  are not automatically redacted.
- Captured commands have a maximum five-minute observation timeout.
- The direct client accepts at most 4 MiB across stdout and stderr.
- `step.sandbox` retains at most 2 MiB and keeps the tail when it truncates.
- Captured `stdout` and `stderr` are UTF-8 strings. Invalid or truncated byte sequences use the Unicode replacement character.
- Log and managed-process output chunks remain byte-safe `Uint8Array` values.

### Managed-process output is best effort

- Each process retains approximately 512 KiB across stdout and stderr.
- Only the newest 32 process output rings are retained.
- Output chunks are arbitrary byte segments, not lines.
- Slow live consumers can miss chunks.
- Streams have no sequence number, resume token, or loss marker.
- Manual reconnection can replay retained chunks and produce duplicates.

Persist important output to a file or external store before destroying the sandbox.

### Process signalling has a beta limitation

The SDK defaults `includeChildren` to `true`; the REST API defaults it to `false`. Pass it explicitly. Use `false` for graceful `SIGTERM`. Currently, `true` is reliable only with `SIGKILL`; using descendant delivery with another signal can make terminal state unobservable and produce `LOST`.

### Understand `operation_ambiguous`

`operation_ambiguous` is an error about an unsafe-to-repeat operation's outcome. It is not a sandbox or process state. It means an operation may have completed even though Inngest could not confirm its result.

A `SandboxError` always includes `action`, which tells you what was attempted:

- `exec`: The command may have run. Inspect its external effects or an application-defined completion marker. Do not run it again automatically.
- `process.start`: A process may be running even though its UUID did not reach the caller. List processes and compare command and start time. If you cannot identify it confidently, stop and reconcile manually rather than starting another process.
- `process.signal`: The signal may have been delivered. Get or wait for the process. Send another signal only when duplicate delivery is safe for that signal and application.

Create, Destroy, and file upload do not use `operation_ambiguous` for an unconfirmed response. Create is safe to repeat with the same active name and full Create intent; secret selection order does not matter, but the resolved secret identities do. Destroy records teardown intent before contacting the node, and repeating the same upload with the same path, bytes, and mode produces the same file. The SDK reports these failures as retryable availability errors.

Inside an Inngest function, let an unexpected ambiguous error escape. It is non-retryable. Catch it only when the function implements a deliberate reconciliation or operator-review path.

### Cleanup is your responsibility

Destroying a sandbox removes its processes, retained output, and filesystem. Use `finally` with the direct client. In an Inngest function, keep Destroy as a normal step on the successful path and add an `onFailure` cleanup strategy when leaked resources are unacceptable.

When cleanup must also run after permanent failure, use an `onFailure` handler or a separate deferred cleanup function that receives the sandbox ID. A deferred cleanup function is not equivalent to JavaScript `finally`.

## Feedback and known issues

This beta exists to validate the API and ergonomics. When reporting feedback, include:

- whether you used `inngest.sandboxes` or `step.sandbox`
- the operation and stable error `code`
- the sandbox or process ID, when available
- whether retrying could duplicate a mutation
- what behavior you expected instead
