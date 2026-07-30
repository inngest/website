# Inngest Sandboxes beta: getting started

> **This is an early, experimental beta.** The SDK is distributed from a prerelease pull request, the API is access-gated, and the contract can change without a compatibility period. Use it for evaluation and feedback—not production workloads or data you cannot recreate.

Inngest Sandboxes give server-side code and Inngest functions an isolated Linux environment where they can:

- run commands and capture stdout, stderr, and exit codes;
- upload and download files;
- start and manage background processes; and
- read retained output or follow live output streams.

This guide uses the TypeScript SDK from [`inngest-js` PR #1654](https://github.com/inngest/inngest-js/pull/1654).

## Before you start

You need:

1. A Node.js 20 or newer server runtime with the standard Fetch API.
2. An Inngest account and environment with Sandbox beta access enabled.
3. Your environment's Inngest signing key in `INNGEST_SIGNING_KEY`.
4. A server-side project. Do not use the Sandbox client in a browser.

Sandbox access is currently enabled manually. If Create returns `403 access_denied`, ask the Inngest team to enable the beta for your environment.

## 1. Install the prerelease SDK

Install the build published from PR #1654:

```sh
npm install inngest@pr-1654
```

Commit your lockfile. The `pr-1654` prerelease is temporary and should be replaced with a normal SDK version when the beta is released.

## 2. Create an Inngest client

Create one shared client:

```ts
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

```ts
// inngest/functions/run-in-sandbox.ts
import { inngest } from "../client";

export const runInSandbox = inngest.createFunction(
  {
    id: "run-in-sandbox",
    triggers: { event: "sandbox/demo.requested" },
  },
  async ({ event, step }) => {
    let sandbox = await step.sandbox.create("create-sandbox", {
      // Use stable, lowercase input in real functions.
      name: `beta-${event.data.jobId}`,
      vcpu: 2,
      memoryMb: 512,
    });

    // Create can return before the runtime is ready.
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
      throw new Error(`Sandbox did not start: ${sandbox.status}`);
    }

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

`step.sandbox.create()` returns a usable Sandbox object during both fresh execution and replay. Do not wrap it in another `step.run`, serialize the object, or reconstruct it manually; the middleware memoizes the operation result and restores the Sandbox object automatically.

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

The direct client is not durable and never retries automatically, so your code owns readiness polling, retries, and cleanup.

```ts
import type { Sandbox } from "inngest/experimental";
import { inngest } from "./inngest/client";

let sandbox: Sandbox | undefined;

try {
  sandbox = await inngest.sandboxes.create({
    name: `beta-direct-${crypto.randomUUID()}`,
    vcpu: 2,
    memoryMb: 512,
  });

  for (
    let attempt = 0;
    sandbox.status === "STARTING" && attempt < 60;
    attempt++
  ) {
    await new Promise((resolve) => setTimeout(resolve, 1_000));

    const current = await inngest.sandboxes.get(sandbox.id);
    if (!current) {
      throw new Error("Sandbox disappeared while starting");
    }
    sandbox = current;
  }

  if (sandbox.status !== "RUNNING") {
    throw new Error(`Sandbox did not start: ${sandbox.status}`);
  }

  const result = await sandbox.commands.run({
    command: ["/bin/sh", "-c", "printf 'hello from a direct client\n'"],
    timeout: "30s",
  });

  console.log(new TextDecoder().decode(result.stdout));
} finally {
  await sandbox?.destroy();
}
```

The returned Sandbox object is an immutable snapshot. Call `inngest.sandboxes.get(sandbox.id)` to retrieve current state.

When work needs to reconnect later, store only `sandbox.id` and call `inngest.sandboxes.get(sandboxId)` or `step.sandbox.get("get-sandbox", sandboxId)`. The SDK does not expose public object-attachment or snapshot-reconstruction helpers.

## 5. Start and manage a background process

Use a managed process for a server, watcher, worker, or command that should keep running after Start returns. The following examples assume `sandbox` is a `RUNNING` sandbox that has not been destroyed:

```ts
let worker = await sandbox.processes.start({
  command: ["/bin/sh", "-c", "printf 'worker started\n'; exec /bin/sleep 300"],
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

```ts
let worker = await sandbox.processes.start("start-worker", {
  command: ["/bin/sh", "-c", "exec /bin/sleep 300"],
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

```ts
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

```ts
let streamingWorker = await sandbox.processes.start({
  command: [
    "/bin/sh",
    "-c",
    "sleep 1; printf 'stream complete\n'; exec /bin/sleep 300",
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

| Capability | `inngest.sandboxes` | `step.sandbox` |
| --- | :-: | :-: |
| Create, List, Get, and Destroy | Yes | Yes |
| Captured commands | Yes | Yes |
| Start, List, Get, Signal, and Wait for processes | Yes | Yes |
| Retained process output | Yes | Yes |
| Live sandbox logs | Yes | No |
| Live process output | Yes | No |
| File upload and download | Yes | No |

Use `step.sandbox` for operations that belong to an Inngest function and should be memoized as steps. Use `inngest.sandboxes` when you need an immediate server-side client, live streams, or file bodies.

## Important beta caveats

### The contract is unstable

This is a prerelease SDK backed by an in-development API. Method names, types, limits, error codes, and behavior can change. Do not depend on semver compatibility until Sandboxes have a normal SDK release.

### Access and capacity are gated

The public API is cloud-only and entitlement-gated. CPU and memory requests must match available capacity and can be rejected. The examples request 2 vCPU and 512 MiB because that is the smallest currently exercised beta profile.

### Configuration is intentionally limited

Create uses the workspace's default egress-only VPC, default image, and current platform policy. The beta does not expose custom VPCs, images, templates, disk sizes, snapshots, clones, pause/resume, resizing, or a user-configurable TTL.

### Sandboxes and processes are live resources

Durable steps memoize operation results; they do not make the sandbox, guest process, filesystem, or output durable. Process metadata and output are held in memory and disappear when the sandbox is destroyed. Runtime loss can also lose a process without recovery.

### Mutations are not exactly once

The beta `step.sandbox` implementation uses ordinary `step.run` memoization. A completed step is not sent again on replay, but a mutation can happen twice if the API commits it and the function process stops before Inngest persists the step result.

Create, captured commands, process Start, Signal, Destroy, and file upload can also return `operation_ambiguous` when the platform cannot prove whether a mutation happened. Never retry `operation_ambiguous` automatically.

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

### Cleanup is your responsibility

Destroying a sandbox removes its processes, retained output, and filesystem. Use `finally` with the direct client. In an Inngest function, keep Destroy as a normal step on the successful path and add an `onFailure` cleanup strategy when leaked resources are unacceptable.

## Feedback and known issues

This beta exists to validate the API and ergonomics. When reporting feedback, include:

- whether you used `inngest.sandboxes` or `step.sandbox`;
- the operation and stable error `code`;
- the sandbox or process ID, when available;
- whether retrying could duplicate a mutation; and
- the SDK prerelease (`inngest@pr-1654`).

Track the prerelease implementation or leave feedback on [`inngest-js` PR #1654](https://github.com/inngest/inngest-js/pull/1654).
