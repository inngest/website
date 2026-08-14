> **This is an early, experimental beta.** The API is access-gated, and the contract can change without a compatibility period. Use it for evaluation and feedback—not production workloads or data you cannot recreate.

Inngest Sandboxes give server-side code and Inngest functions an isolated Linux environment where they can:

- run commands and capture stdout, stderr, and exit codes
- upload and download files
- start and manage background processes
- read retained output or follow live output streams

## Before you start

You need:

1. A Node.js 20 or newer server runtime with the standard Fetch API.
2. An Inngest account and environment with Sandbox beta access enabled.
3. Your environment's Inngest signing key in `INNGEST_SIGNING_KEY`.
4. A server-side project. Do not use the Sandbox client in a browser.

Sandbox access is currently enabled manually. If Create returns `403 access_denied`, ask the Inngest team to enable the beta for your environment.

## 1. Install the SDK

Install latest:

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
      vcpu: 2,
      memoryMb: 512,
      runningTimeout: "60s",
    });

    const result = await sandbox.commands.run("run-command", {
      command: [
        "/bin/sh",
        "-c",
        "printf 'hello from the sandbox\n'; printf 'diagnostic\n' >&2",
      ],
      cwd: "/",
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

`step.sandbox.create()` returns a Sandbox facade on both fresh execution and replay. You do not need to serialize or reconstruct it manually. With `runningTimeout`, Create waits for `RUNNING`; when it is omitted, Create returns as soon as the API accepts the sandbox. Waiting never repeats Create, is capped at five minutes, and does not destroy the sandbox if readiness times out.

When you need the sandbox ID before waiting—for example, to guarantee cleanup after a readiness timeout—use the explicit durable helper:

```ts
const sandbox = await step.sandbox.create("create-sandbox", options);

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
    vcpu: 2,
    memoryMb: 512,
  });

  sandbox = await sandbox.waitUntilRunning({ timeout: "60s" });

  const result = await sandbox.commands.run({
    command: ["/bin/sh", "-c", "printf 'hello from a direct client\n'"],
    timeout: "30s",
  });

  console.log(new TextDecoder().decode(result.stdout));
} finally {
  await sandbox?.destroy();
}
```

The returned Sandbox object is an immutable snapshot. `waitUntilRunning()` and Get return a new facade with current state; they do not mutate the original object.

When work needs to reconnect later, store only `sandbox.id` and call `inngest.sandboxes.get(sandboxId)` or `step.sandbox.get("get-sandbox", sandboxId)`. There is no manual attach or serialization step.

## 5. Start and manage a background process

Use a managed process for a server, watcher, worker, or command that should keep running after Start returns. The following examples assume `sandbox` is a `RUNNING` sandbox that has not been destroyed:

```tsx
let worker = await sandbox.processes.start({
  command: ["/bin/sh", "-c", "printf 'worker started\n'; exec /bin/sleep 30"],
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
  command: ["/bin/sh", "-c", "exec /bin/sleep 30"],
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
  command: [
    "/bin/sh",
    "-c",
    "sleep 1; printf 'stream complete\n'; exec /bin/sleep 30",
  ],
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

## Which client should I use?

| Capability                                       | `inngest.sandboxes` | `step.sandbox` |
| ------------------------------------------------ | ------------------- | -------------- |
| Create, List, Get, and Destroy                   | Yes                 | Yes            |
| Captured commands                                | Yes                 | Yes            |
| Start, List, Get, Signal, and Wait for processes | Yes                 | Yes            |
| Retained process output                          | Yes                 | Yes            |
| Live sandbox logs                                | Yes                 | No             |
| Live process output                              | Yes                 | No             |
| File upload and download                         | Yes                 | No             |

Use `step.sandbox` for operations that belong to an Inngest function and should be memoized as steps. Use `inngest.sandboxes` when you need an immediate server-side client, live streams, or file bodies.

## Important beta caveats

### The contract is unstable

This is an experimental SDK backed by an in-development API. Method names, types, limits, error codes, and behavior can change. Do not depend on semver compatibility until Sandboxes have a stable SDK release.

### Access and capacity are gated

The public API is cloud-only and entitlement-gated. CPU and memory requests must match available capacity and can be rejected. The examples request 2 vCPU and 512 MiB because that is the smallest currently exercised beta profile.

### Configuration is intentionally limited

Create uses the workspace's default egress-only VPC, default image, and current platform policy. The beta does not expose custom VPCs, images, templates, disk sizes, snapshots, clones, pause/resume, resizing, or a user-configurable TTL.

### Sandboxes and processes are live resources

Durable steps memoize operation results; they do not make the sandbox, guest process, filesystem, or output durable. Process metadata and output are held in memory and disappear when the sandbox is destroyed. Runtime loss can also lose a process without recovery.

### Commands have strict semantics

- Commands are argument arrays, not shell strings.
- `command[0]` must be an absolute executable path.
- Invoke `/bin/sh` explicitly when you need shell syntax.
- A supplied `environment` replaces the guest environment; it is not merged.
- Captured commands have a maximum five-minute observation timeout.
- The direct client accepts at most 4 MiB across stdout and stderr.
- `step.sandbox` retains at most 2 MiB and keeps the tail when it truncates.
- Output is `Uint8Array`; decode it only when you know it is text.

### Managed-process output is best effort

- Each process retains approximately 512 KiB across stdout and stderr.
- Only the newest 32 process output rings are retained.
- Output chunks are arbitrary byte segments, not lines.
- Slow live consumers can miss chunks.
- Streams have no sequence number, resume token, or loss marker.
- Manual reconnection can replay retained chunks and produce duplicates.

Persist important output to a file or external store before destroying the sandbox.

### Process signalling has a beta limitation

Use `includeChildren: false` for graceful `SIGTERM`. Currently, `includeChildren: true` is reliable only with `SIGKILL`; using descendant delivery with another signal can make terminal state unobservable and produce `LOST`.

### Understand `operation_ambiguous`

`operation_ambiguous` is an error about an unsafe-to-repeat operation's outcome. It is not a sandbox or process state. It means an operation may have completed even though Inngest could not confirm its result.

A `SandboxError` always includes `action`, which tells you what was attempted:

- `exec`: The command may have run. Inspect its external effects or an application-defined completion marker. Do not run it again automatically.
- `process.start`: A process may be running even though its UUID did not reach the caller. List processes and compare command and start time. If you cannot identify it confidently, stop and reconcile manually rather than starting another process.
- `process.signal`: The signal may have been delivered. Get or wait for the process. Send another signal only when duplicate delivery is safe for that signal and application.

Create, Destroy, and file upload do not use `operation_ambiguous` for an unconfirmed response. Create is safe to repeat with the same active name and resources, Destroy records teardown intent before contacting the node, and repeating the same upload with the same path, bytes, and mode produces the same file. The SDK reports these failures as retryable availability errors.

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
