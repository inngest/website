# Sandbox documentation research and decisions

This is the implementation record behind the public Sandbox documentation. It
separates verified behavior from product decisions that still need an owner.

## Source workspaces

### TypeScript SDK and middleware

```text
/home/jakob/inngest-work/inngest-js-sandbox-middleware
```

Primary sources:

- `packages/inngest/src/components/sandbox/types.ts`
- `packages/inngest/src/components/sandbox/validation.ts`
- `packages/inngest/src/components/sandbox/client.ts`
- `packages/inngest/src/components/sandbox/durable.ts`
- `packages/inngest/src/components/sandbox/protocol.ts`
- `packages/inngest/src/components/sandbox/middleware.ts`
- `packages/inngest/src/components/InngestSandbox.ts`
- `packages/inngest/src/components/InngestSandbox.test.ts`
- `packages/inngest/src/components/Inngest.ts`

These define the public types, direct REST client, immutable facades,
middleware-backed `step.sandbox` adapter, binary encoding, retry mapping,
captured-output truncation, and replay behavior.

### REST and trusted compute API

```text
/home/jakob/inngest-work/monorepo-sandbox-middleware
```

Primary sources:

- `api/rest/v2/api_sandboxes.go`
- `api/rest/v2/api_sandbox.go`
- `api/rest/v2/api_sandbox_exec.go`
- `api/rest/v2/api_sandbox_logs.go`
- `api/rest/v2/api_sandbox_files.go`
- `api/rest/v2/api_sandbox_processes.go`
- matching `api_sandbox*_test.go` files
- `pkg/compute/sandbox.go`
- `pkg/compute/sandbox_file.go`
- `pkg/compute/sandbox_process.go`
- `docs/plans/sandbox-apis.md`
- `scripts/local-sandbox-lifecycle-e2e.sh`

These define routes, statuses, envelopes, strict JSON behavior, workspace
scope, pagination, no-store headers, file transfer, output limits, and stream
admission.

### Simcity runtime

```text
/home/jakob/inngest-work/simcity-sandbox-runtime
```

Primary sources:

- `proto/simcity/node/v1/node.proto`
- `proto/simcity/compute/v1/common.proto`
- `pkg/vmapi/validation.go`
- `pkg/vmapi/vmserver/procmgr_linux.go`
- `pkg/vmapi/vmserver/logbuf.go`
- `pkg/vmapi/vmserver/handlers_linux.go`
- `pkg/vmapi/vmserver/filemgr_linux.go`
- `cmd/simcity-init/exec_helper_linux.go`

These define process states, environment behavior, argument limits, output
retention, slow-subscriber loss, signal semantics, PID meaning, and file
safety.

## Documentation structure

Public pages:

```text
Sandboxes
├── Overview
├── Managed processes
├── Errors and retries
└── Limitations

Reference
├── TypeScript SDK v4
│   └── Sandboxes
└── REST API
    └── Sandboxes
```

The overview teaches the first successful lifecycle and the direct-versus-step
choice. Guides own task-oriented behavior and warnings. References own exact
method or endpoint contracts.

## Contract decisions reflected in the docs

### Direct and step clients are separate surfaces

`inngest.sandboxes` performs immediate REST calls. `step.sandbox` wraps the
same REST client in ordinary `step.run` calls.

The step surface memoizes completed results but has the normal at-least-once
window for an external mutation. It has no sandbox-specific executor opcode or
dispatch fence.

### Commands and processes are different primitives

Captured commands are bounded calls that return stdout, stderr, and an exit
code. Managed processes are background resources with explicit List, Get,
Signal, Wait, retained-output, and live-output operations.

### Output is byte-safe

REST uses base64. The SDK exposes `Uint8Array`. Text examples decode bytes
explicitly.

Direct captured Exec accepts 4 MiB. `step.sandbox` retains 2 MiB so the
base64-encoded result fits under the step-output limit. Larger successful
results retain tails and report original and retained byte counts.

### Ambiguity is part of the API model

`operation_ambiguous` means the platform cannot prove whether a mutation
happened. Captured Exec timeout and output-limit failures are also classified
as ambiguous because the command may have run.

### Process state and output are ephemeral

Process metadata and output are memory-only and disappear with the sandbox or
runtime. Approximately 512 KiB is retained per process, and only the newest 32
output rings remain available.

### Terminal stream errors use the standard array

NDJSON error frames use:

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

This matches ordinary v2 error envelopes and the TypeScript parser.

## Open product decisions

### Release phase and availability

The implementation is experimental, but the public launch label, eligible
plans, regions, pricing, and support path have not been supplied.

Decide whether the pages should be public, gated, or marked Developer Preview,
Private Beta, Public Beta, or GA.

### SDK authentication

Hand-written REST clients use `INNGEST_API_KEY`. The first-party
`inngest.sandboxes` client currently uses the `Inngest` client's signing key.

Decide whether this difference is intentional or whether the SDK needs
first-class API-key configuration and precedence.

### Default image contract

The API returns `imageRef: "default"`, but there is no public contract for:

- distribution and version;
- installed tools and language runtimes;
- user, UID, and permissions;
- guaranteed directories;
- writable capacity;
- outbound networking and DNS; or
- image compatibility policy.

Public examples therefore use only `/bin/sh`, `/`, and `/tmp`, which are
covered by the lifecycle E2E.

### Lifetime, quotas, and billing

Public documentation still needs:

- maximum sandbox lifetime and idle behavior;
- account concurrency and create-rate limits;
- behavior when callers do not destroy resources;
- filesystem capacity; and
- billing units.

### Resource reconnection

Public callers persist sandbox and process IDs rather than serialized resource
references. Reload a sandbox with `sandboxes.get(sandboxId)`, then reload a
process with `sandbox.processes.get(processId)`. Middleware handles durable
result reconstruction internally.

### Sandbox readiness

Create can return `STARTING`, but there is no readiness method or endpoint.
The overview includes bounded polling. A future helper could remove repeated
user code.

### Name validation message

The enforced regex accepts underscores:

```text
^[a-z0-9_-]{1,63}$
```

The compute validation message mentions only letters, numbers, and dashes.
Update the message before publishing exact validation text.

### Binary download truncation

File download exposes `Content-Length`, but the SDK returns a raw `Response`
and does not verify the received length. Decide whether callers own
verification or the SDK should provide a checked wrapper.

### Output-loss signalling

The runtime drops output for slow subscribers rather than blocking the guest.
Frames have no sequence or loss marker.

Decide whether best-effort delivery is acceptable or whether the protocol
needs sequence numbers or explicit loss frames.

### Public sandbox statuses

The resource union includes `PENDING` and `PAUSED`, but no public pause or
resume operation exists. Decide whether to expose every observable platform
state or narrow the SDK union.

### Process mutation error mapping

The intended contract distinguishes missing processes, invalid input,
non-running sandboxes, and uncertain mutations.

The current REST mutation helper maps every non-wire Start or Signal RPC error
to `409 operation_ambiguous` before inspecting the Connect code. A confirmed
node-side validation, not-found, or state error can therefore be reported as
ambiguous.

Carry confirmed-dispatch state or a typed ambiguity reason from compute, then
reserve `operation_ambiguous` for genuinely unknown outcomes.

## Verification before publication

Run the real authenticated Iroh-backed lifecycle:

1. Create, List, and Get.
2. Verify both 201 `RUNNING` and 202 `STARTING`.
3. Run captured Exec with binary stdout and stderr.
4. Verify direct 4 MiB and step 2 MiB output boundaries.
5. Upload and download a binary file.
6. Start, paginate, Get, Signal, and Wait for a process.
7. Read retained output.
8. Tail and follow live output.
9. Verify terminal `errors[]` frames and cancellation.
10. Destroy and observe terminal state.

Copy real response examples into the reference after this verification.
