const NODES = [
  {
    kind: "Event",
    name: "challenge.started",
    status: "Fired",
    state: "done" as const,
  },
  {
    kind: "step.run",
    name: "start-the-thing",
    status: "Checkpointed",
    state: "done" as const,
  },
  {
    kind: "step.sleep",
    name: "grab-coffee · 20m",
    status: "Parked",
    state: "live" as const,
  },
  {
    kind: "waitForEvent",
    name: "challenge.continue",
    status: "Listening",
    state: "wait" as const,
  },
  {
    kind: "step.run",
    name: "finish-it",
    status: "Queued",
    state: "wait" as const,
  },
] as const;

export default function RunDiagram() {
  return (
    <figure className="overflow-hidden rounded-lg border border-v1-subtle bg-v1-surfaceElevated">
      <div className="flex items-center justify-between gap-3 border-b border-v1-subtle px-5 py-3">
        <p className="font-v1Label text-[11px] uppercase tracking-[0.08em] text-v1-frost/70">
          inngest · run
        </p>
        <span className="inline-flex items-center gap-2 font-v1Label text-[11px] uppercase tracking-[0.08em] text-v1-accent-green">
          <span
            aria-hidden="true"
            className="v1-codetv-pulse size-1.5 rounded-full bg-v1-accent-green"
          />
          Still going
        </span>
      </div>

      <ol className="flex flex-col gap-0 lg:flex-row lg:items-stretch">
        {NODES.map((node, i) => (
          <li
            key={node.name}
            className="relative flex flex-1 flex-col border-v1-subtle px-5 py-5 max-lg:border-b lg:border-r lg:last:border-r-0 max-lg:last:border-b-0"
          >
            {i < NODES.length - 1 && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-1/2 z-10 hidden h-px w-3 -translate-x-1/2 translate-y-1/2 bg-v1-frost/25 lg:left-auto lg:right-0 lg:top-1/2 lg:block lg:h-px lg:w-3 lg:translate-x-1/2 lg:translate-y-0"
              />
            )}
            <p className="font-v1Label text-[11px] uppercase tracking-[0.08em] text-v1-accent-salmon">
              {node.kind}
            </p>
            <p className="mt-3 font-v1Mono text-[13px] leading-[1.4] text-v1-frost">
              {node.name}
            </p>
            <p
              className={
                node.state === "live"
                  ? "mt-3 font-v1Label text-[11px] uppercase tracking-[0.08em] text-v1-accent-green"
                  : "mt-3 font-v1Label text-[11px] uppercase tracking-[0.08em] text-v1-frost/45"
              }
            >
              {node.status}
            </p>
          </li>
        ))}
      </ol>

      <figcaption className="border-t border-v1-subtle px-5 py-4 font-v1Label text-[11px] uppercase tracking-[0.08em] text-v1-frost/55">
        Crash anywhere in the chain and Inngest retries from the last
        checkpoint — not from scratch.
      </figcaption>
    </figure>
  );
}