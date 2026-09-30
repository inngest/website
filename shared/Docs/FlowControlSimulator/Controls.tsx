"use client";

import {
  RiAddLine,
  RiArrowRightUpLine,
  RiCheckLine,
  RiCloseLine,
  RiFileCopyLine,
  RiInformationLine,
} from "@remixicon/react";
import clsx from "clsx";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { generateCode } from "./codegen";
import {
  conflictFor,
  fmtSeconds,
  interactionNotes,
  type ConcurrencyKey,
  type ControlId,
  type KeyMode,
  type Scope,
  type SimConfig,
  type TrafficSource,
} from "./engine";
import { TENANT_IDS } from "./presets";
import {
  Button,
  Field,
  IconButton,
  NumberInput,
  Segmented,
  Select,
  Switch,
  TenantChip,
} from "./ui";

type Update = (fn: (draft: SimConfig) => void) => void;

const KEY_OPTIONS: { value: KeyMode; label: string }[] = [
  { value: "none", label: "No key" },
  { value: "tenant", label: "Per tenant" },
];

const DOCS = "/docs/durable-execution/flow-control";

function StageHeading({ children }: { children: ReactNode }) {
  return (
    <div className="col-span-full pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted first:pt-0">
      {children}
    </div>
  );
}

function Hint({ children }: { children: ReactNode }) {
  return <p className="m-0 text-[11px] leading-snug text-muted">{children}</p>;
}

function Fields({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-3 gap-2">{children}</div>;
}

/** One flow control: a switch, a name, and its fields when it's on. */
function ControlRow({
  id,
  cfg,
  update,
  title,
  href,
  summary,
  alwaysOn,
  badge,
  children,
}: {
  id?: ControlId;
  cfg: SimConfig;
  update: Update;
  title: string;
  href: string;
  summary: string;
  alwaysOn?: boolean;
  badge?: string;
  children?: ReactNode;
}) {
  const enabled = alwaysOn || (id ? cfg[id].enabled : false);
  const conflict = id && !enabled ? conflictFor(cfg, id) : null;
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-start gap-2.5">
        <div className="w-8 shrink-0 pt-0.5">
          {alwaysOn ? (
            <span
              className="inline-flex h-[18px] w-8 items-center justify-center rounded-full bg-matcha-600 text-[9px] font-semibold uppercase text-white dark:bg-matcha-500 dark:text-carbon-1000"
              title="Every function in the simulator has a concurrency limit"
            >
              on
            </span>
          ) : (
            <Switch
              checked={enabled}
              disabled={!!conflict}
              label={`Enable ${title}`}
              onChange={(v) =>
                update((d) => {
                  if (id) d[id].enabled = v;
                })
              }
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span
              className={clsx(
                "text-xs font-semibold",
                conflict ? "text-muted" : "text-basis"
              )}
            >
              {title}
            </span>
            {badge && (
              <span className="rounded bg-canvasBase px-1 text-[10px] font-medium text-subtle">
                {badge}
              </span>
            )}
            <Link
              href={href}
              className="text-muted hover:text-basis"
              aria-label={`${title} docs`}
              title={`${title} docs`}
            >
              <RiArrowRightUpLine className="h-3.5 w-3.5" />
            </Link>
          </div>
          <p className="m-0 mt-0.5 text-[11px] leading-snug text-muted">
            {conflict || summary}
          </p>
        </div>
      </div>
      {enabled && children && (
        <div className="ml-[42px] flex flex-col gap-2">{children}</div>
      )}
    </div>
  );
}

export function FlowSettings({
  cfg,
  update,
  twoCol,
}: {
  cfg: SimConfig;
  update: Update;
  twoCol: boolean;
}) {
  const rlBurst = Math.floor(cfg.rateLimit.limit / 10) + 1;
  const notes = interactionNotes(cfg);
  return (
    <div className="flex flex-col gap-4">
      {notes.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {notes.map((n) => (
            <li
              key={n}
              className="m-0 flex items-start gap-1.5 p-0 text-[11px] leading-snug text-subtle"
            >
              <RiInformationLine className="mt-px h-3.5 w-3.5 shrink-0 text-muted" />
              {n}
            </li>
          ))}
        </ul>
      )}
      <div
        className={clsx(
          "grid items-start gap-x-8 gap-y-4",
          twoCol ? "grid-cols-2" : "grid-cols-1"
        )}
      >
        <StageHeading>1 · Before scheduling</StageHeading>
        <ControlRow
          id="rateLimit"
          cfg={cfg}
          update={update}
          title="Rate limiting"
          href={`${DOCS}/rate-limiting`}
          summary="Skip runs above a start limit per period."
        >
          <Fields>
            <Field label="limit">
              <NumberInput
                value={cfg.rateLimit.limit}
                min={1}
                max={1000}
                onChange={(v) =>
                  update((d) => void (d.rateLimit.limit = Math.round(v)))
                }
              />
            </Field>
            <Field label="period">
              <NumberInput
                value={cfg.rateLimit.period}
                min={1}
                max={600}
                suffix="s"
                onChange={(v) =>
                  update((d) => void (d.rateLimit.period = Math.round(v)))
                }
              />
            </Field>
            <Field label="key">
              <Select
                value={cfg.rateLimit.key}
                options={KEY_OPTIONS}
                onChange={(v) => update((d) => void (d.rateLimit.key = v))}
              />
            </Field>
          </Fields>
          <Hint>
            {rlBurst} can start at once, then one every{" "}
            {fmtSeconds(
              Number((cfg.rateLimit.period / cfg.rateLimit.limit).toFixed(2))
            )}
            . Excess events are skipped.
          </Hint>
        </ControlRow>
        <ControlRow
          id="batching"
          cfg={cfg}
          update={update}
          title="Batching"
          href={`${DOCS}/batching`}
          summary="Collect events into one run."
        >
          <Fields>
            <Field label="maxSize">
              <NumberInput
                value={cfg.batching.maxSize}
                min={1}
                max={100}
                onChange={(v) =>
                  update((d) => void (d.batching.maxSize = Math.round(v)))
                }
              />
            </Field>
            <Field label="timeout">
              <NumberInput
                value={cfg.batching.timeout}
                min={1}
                max={300}
                suffix="s"
                onChange={(v) =>
                  update((d) => void (d.batching.timeout = Math.round(v)))
                }
              />
            </Field>
            <Field label="key">
              <Select
                value={cfg.batching.key}
                options={KEY_OPTIONS}
                onChange={(v) => update((d) => void (d.batching.key = v))}
              />
            </Field>
          </Fields>
          <Hint>
            Starts at maxSize events, or when the timeout passes after the first
            event.
          </Hint>
        </ControlRow>

        <StageHeading>2 · When scheduling</StageHeading>
        <ControlRow
          id="debounce"
          cfg={cfg}
          update={update}
          title="Debounce"
          href={`${DOCS}/debounce`}
          summary="Wait for a quiet period, then run once with the last event."
        >
          <Fields>
            <Field label="period">
              <NumberInput
                value={cfg.debounce.period}
                min={1}
                max={600}
                suffix="s"
                onChange={(v) =>
                  update((d) => void (d.debounce.period = Math.round(v)))
                }
              />
            </Field>
            <Field label="timeout">
              <div className="flex items-center gap-1.5">
                <Switch
                  checked={cfg.debounce.useTimeout}
                  label="Use a timeout"
                  onChange={(v) =>
                    update((d) => void (d.debounce.useTimeout = v))
                  }
                />
                {cfg.debounce.useTimeout && (
                  <NumberInput
                    ariaLabel="Debounce timeout"
                    value={cfg.debounce.timeout}
                    min={1}
                    max={600}
                    suffix="s"
                    onChange={(v) =>
                      update((d) => void (d.debounce.timeout = Math.round(v)))
                    }
                  />
                )}
              </div>
            </Field>
            <Field label="key">
              <Select
                value={cfg.debounce.key}
                options={KEY_OPTIONS}
                onChange={(v) => update((d) => void (d.debounce.key = v))}
              />
            </Field>
          </Fields>
        </ControlRow>
        <ControlRow
          id="singleton"
          cfg={cfg}
          update={update}
          title="Singleton"
          href={`${DOCS}/singleton`}
          summary="Keep one active run per key."
        >
          <div className="flex flex-wrap items-end gap-3">
            <Field label="mode">
              <Segmented
                ariaLabel="Singleton mode"
                value={cfg.singleton.mode}
                options={[
                  { value: "skip", label: "skip" },
                  { value: "cancel", label: "cancel" },
                ]}
                onChange={(v) => update((d) => void (d.singleton.mode = v))}
              />
            </Field>
            <Field label="key" className="w-32">
              <Select
                value={cfg.singleton.key}
                options={[
                  { value: "tenant", label: "Per tenant" },
                  { value: "global", label: "One global key" },
                ]}
                onChange={(v) => update((d) => void (d.singleton.key = v))}
              />
            </Field>
          </div>
          <Hint>
            {cfg.singleton.mode === "skip"
              ? "New events for a key with an active run are skipped."
              : "A new event cancels the active run. An executing step finishes first."}
          </Hint>
        </ControlRow>

        <StageHeading>3 · When executing</StageHeading>
        <ControlRow
          alwaysOn
          cfg={cfg}
          update={update}
          title="Step concurrency"
          href={`${DOCS}/concurrency`}
          summary="Caps steps executing at once. Sleeping runs hold no slot."
        >
          {cfg.concurrency.constraints.map((c, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Fields>
                <Field
                  label={
                    cfg.concurrency.constraints.length > 1
                      ? `limit ${i + 1}`
                      : "limit"
                  }
                >
                  <NumberInput
                    value={c.limit}
                    min={1}
                    max={100}
                    onChange={(v) =>
                      update(
                        (d) =>
                          void (d.concurrency.constraints[i].limit =
                            Math.round(v))
                      )
                    }
                  />
                </Field>
                <Field label="key">
                  <Select<ConcurrencyKey>
                    value={c.key}
                    options={[
                      { value: "none", label: "No key" },
                      { value: "tenant", label: "Per tenant" },
                      { value: "shared", label: "Shared string" },
                    ]}
                    onChange={(v) =>
                      update((d) => {
                        const cc = d.concurrency.constraints[i];
                        cc.key = v;
                        if (v === "none") cc.scope = "fn";
                        if (v === "shared" && cc.scope === "fn")
                          cc.scope = "account";
                      })
                    }
                  />
                </Field>
                <Field label="scope">
                  <div className="flex items-center gap-1">
                    <Select<Scope>
                      value={c.scope}
                      options={
                        c.key === "none"
                          ? [{ value: "fn", label: "fn" }]
                          : [
                              { value: "fn", label: "fn" },
                              { value: "env", label: "env" },
                              { value: "account", label: "account" },
                            ]
                      }
                      onChange={(v) =>
                        update(
                          (d) => void (d.concurrency.constraints[i].scope = v)
                        )
                      }
                    />
                    {cfg.concurrency.constraints.length > 1 && (
                      <IconButton
                        label="Remove this limit"
                        className="!h-6 !w-6 shrink-0"
                        onClick={() =>
                          update(
                            (d) => void d.concurrency.constraints.splice(i, 1)
                          )
                        }
                      >
                        <RiCloseLine className="h-3.5 w-3.5" />
                      </IconButton>
                    )}
                  </div>
                </Field>
              </Fields>
              {c.key === "shared" && (
                <div className="flex items-center gap-2">
                  <div className="w-16">
                    <NumberInput
                      ariaLabel="Slots used by other functions"
                      value={c.externalLoad}
                      min={0}
                      max={Math.max(0, c.limit - 1)}
                      onChange={(v) =>
                        update(
                          (d) =>
                            void (d.concurrency.constraints[i].externalLoad =
                              Math.round(v))
                        )
                      }
                    />
                  </div>
                  <Hint>slots used by other functions sharing this key</Hint>
                </div>
              )}
            </div>
          ))}
          {cfg.concurrency.constraints.length < 2 && (
            <div>
              <Button
                variant="ghost"
                className="!h-6 !px-1.5"
                onClick={() =>
                  update(
                    (d) =>
                      void d.concurrency.constraints.push(
                        d.concurrency.constraints[0]?.key === "tenant"
                          ? {
                              limit: 8,
                              key: "shared",
                              scope: "account",
                              externalLoad: 0,
                            }
                          : {
                              limit: 2,
                              key: "tenant",
                              scope: "fn",
                              externalLoad: 0,
                            }
                      )
                  )
                }
              >
                <RiAddLine className="h-3.5 w-3.5" /> Second limit
              </Button>
            </div>
          )}
        </ControlRow>
        <ControlRow
          id="throttle"
          cfg={cfg}
          update={update}
          title="Throttling"
          href={`${DOCS}/throttling`}
          summary="Queue run starts above a rate. Nothing is dropped."
        >
          <div className="grid grid-cols-4 gap-2">
            <Field label="limit">
              <NumberInput
                value={cfg.throttle.limit}
                min={1}
                max={1000}
                onChange={(v) =>
                  update((d) => void (d.throttle.limit = Math.round(v)))
                }
              />
            </Field>
            <Field label="period">
              <NumberInput
                value={cfg.throttle.period}
                min={1}
                max={600}
                suffix="s"
                onChange={(v) =>
                  update((d) => void (d.throttle.period = Math.round(v)))
                }
              />
            </Field>
            <Field label="burst">
              <NumberInput
                value={cfg.throttle.burst}
                min={0}
                max={100}
                onChange={(v) =>
                  update((d) => void (d.throttle.burst = Math.round(v)))
                }
              />
            </Field>
            <Field label="key">
              <Select
                value={cfg.throttle.key}
                options={KEY_OPTIONS}
                onChange={(v) => update((d) => void (d.throttle.key = v))}
              />
            </Field>
          </div>
          <Hint>
            {cfg.throttle.limit + cfg.throttle.burst} can start at once, then
            one every{" "}
            {fmtSeconds(
              Number((cfg.throttle.period / cfg.throttle.limit).toFixed(2))
            )}
            . Applies to run starts only.
          </Hint>
        </ControlRow>
        <ControlRow
          id="priority"
          cfg={cfg}
          update={update}
          title="Priority"
          href={`${DOCS}/priority`}
          summary="Move a tenant's runs forward or back in the queue."
        >
          <div className="grid grid-cols-4 gap-2">
            {cfg.tenants.map((t, i) => (
              <Field key={t.id} label={`tenant ${t.id}`}>
                <NumberInput
                  value={t.priority}
                  min={-600}
                  max={600}
                  step={30}
                  suffix="s"
                  onChange={(v) =>
                    update((d) => void (d.tenants[i].priority = Math.round(v)))
                  }
                />
              </Field>
            ))}
          </div>
          <Hint>
            120 moves a run ahead of runs queued in the previous 120s. Range
            -600 to 600.
          </Hint>
        </ControlRow>
        <div className="flex items-start gap-2.5">
          <div className="w-8 shrink-0 pt-0.5">
            <Switch
              checked={cfg.keyQueues}
              label="Key-queue scheduling"
              onChange={(v) => update((d) => void (d.keyQueues = v))}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-semibold text-basis">
                Key queues
              </span>
              <span className="rounded bg-canvasBase px-1 text-[10px] font-medium text-subtle">
                Enterprise
              </span>
              <Link
                href={`${DOCS}/multi-tenancy`}
                className="text-muted hover:text-basis"
                aria-label="Multi-tenancy docs"
              >
                <RiArrowRightUpLine className="h-3.5 w-3.5" />
              </Link>
            </div>
            <p className="m-0 mt-0.5 text-[11px] leading-snug text-muted">
              Schedule each key separately so one tenant's blocked backlog
              doesn't delay others.
            </p>
          </div>
        </div>
        <ControlRow
          id="startTimeout"
          cfg={cfg}
          update={update}
          title="Start timeout"
          href="/docs/durable-execution/guides-and-advanced/cancellation/timeouts"
          summary="Cancel runs that wait too long to start."
        >
          <div className="w-24">
            <NumberInput
              ariaLabel="Start timeout"
              value={cfg.startTimeout.seconds}
              min={1}
              max={600}
              suffix="s"
              onChange={(v) =>
                update((d) => void (d.startTimeout.seconds = Math.round(v)))
              }
            />
          </div>
        </ControlRow>
      </div>
    </div>
  );
}

let srcCounter = 1000;

export function Steps({ cfg, update }: { cfg: SimConfig; update: Update }) {
  return (
    <div className="flex max-w-xl flex-col gap-5">
      <section className="flex flex-col gap-2">
        <StageHeading>Function steps</StageHeading>
        <Hint>
          Each run executes these steps in order.{" "}
          <code className="text-[11px]">step.run()</code> holds a concurrency
          slot while it executes;{" "}
          <code className="text-[11px]">step.sleep()</code> doesn't.
        </Hint>
        <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
          {cfg.steps.map((s, i) => (
            <li key={i} className="m-0 flex items-center gap-2 p-0">
              <span className="w-3 text-right text-[11px] tabular-nums text-muted">
                {i + 1}
              </span>
              <div className="w-32">
                <Select
                  ariaLabel={`Step ${i + 1} type`}
                  value={s.kind}
                  options={[
                    { value: "run", label: "step.run()" },
                    { value: "sleep", label: "step.sleep()" },
                  ]}
                  onChange={(v) => update((d) => void (d.steps[i].kind = v))}
                />
              </div>
              <div className="w-20">
                <NumberInput
                  ariaLabel={`Step ${i + 1} duration`}
                  value={s.duration}
                  min={0.5}
                  max={120}
                  step={0.5}
                  suffix="s"
                  onChange={(v) =>
                    update((d) => void (d.steps[i].duration = v))
                  }
                />
              </div>
              <IconButton
                label="Remove step"
                disabled={cfg.steps.length <= 1}
                onClick={() => update((d) => void d.steps.splice(i, 1))}
              >
                <RiCloseLine className="h-4 w-4" />
              </IconButton>
            </li>
          ))}
        </ol>
        {cfg.steps.length < 6 && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              className="!h-6 !px-1.5"
              onClick={() =>
                update((d) => void d.steps.push({ kind: "run", duration: 2 }))
              }
            >
              <RiAddLine className="h-3.5 w-3.5" /> step.run
            </Button>
            <Button
              variant="ghost"
              className="!h-6 !px-1.5"
              onClick={() =>
                update((d) => void d.steps.push({ kind: "sleep", duration: 3 }))
              }
            >
              <RiAddLine className="h-3.5 w-3.5" /> step.sleep
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

export function Traffic({ cfg, update }: { cfg: SimConfig; update: Update }) {
  const tenantOptions = cfg.tenants.map((t) => ({
    value: t.id,
    label: t.id,
  }));
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <section className="flex flex-col gap-2">
        <StageHeading>Tenants</StageHeading>
        <div className="flex flex-wrap items-center gap-1">
          {cfg.tenants.map((t, i) => (
            <span
              key={t.id}
              className="inline-flex items-center gap-0.5 rounded-md bg-canvasBase py-0.5 pl-1 pr-0.5"
            >
              <TenantChip id={t.id} />
              <IconButton
                label={`Remove tenant ${t.id}`}
                className="!h-5 !w-5"
                disabled={cfg.tenants.length <= 1}
                onClick={() =>
                  update((d) => {
                    d.tenants.splice(i, 1);
                    d.traffic = d.traffic.filter((s) => s.tenant !== t.id);
                    d.manual = d.manual.filter((m) => m.tenant !== t.id);
                  })
                }
              >
                <RiCloseLine className="h-3 w-3" />
              </IconButton>
            </span>
          ))}
          {cfg.tenants.length < TENANT_IDS.length && (
            <Button
              variant="ghost"
              className="!h-6 !px-1.5"
              onClick={() =>
                update((d) => {
                  const id = TENANT_IDS.find(
                    (x) => !d.tenants.some((t) => t.id === x)
                  )!;
                  d.tenants.push({ id, priority: 0 });
                  d.tenants.sort((a, b) => a.id.localeCompare(b.id));
                  d.traffic.push({
                    id: `s${++srcCounter}`,
                    tenant: id,
                    kind: "steady",
                    from: 0,
                    to: 20,
                    every: 4,
                  });
                })
              }
            >
              <RiAddLine className="h-3.5 w-3.5" /> Tenant
            </Button>
          )}
        </div>
        <Hint>
          Keys use <code className="text-[11px]">event.data.tenant_id</code>.
        </Hint>
      </section>

      <section className="flex flex-col gap-3">
        <StageHeading>Traffic</StageHeading>
        {cfg.traffic.length === 0 && <Hint>No generated traffic.</Hint>}
        {cfg.traffic.map((s, i) => (
          <TrafficRow
            key={s.id}
            src={s}
            tenants={tenantOptions}
            onChange={(ns) => update((d) => void (d.traffic[i] = ns))}
            onRemove={() => update((d) => void d.traffic.splice(i, 1))}
          />
        ))}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            className="!h-6 !px-1.5"
            onClick={() =>
              update(
                (d) =>
                  void d.traffic.push({
                    id: `s${++srcCounter}`,
                    tenant: d.tenants[0].id,
                    kind: "burst",
                    at: 0,
                    count: 10,
                    spread: 0,
                  })
              )
            }
          >
            <RiAddLine className="h-3.5 w-3.5" /> Traffic
          </Button>
          <span className="text-[11px] text-muted">
            {cfg.manual.length
              ? `${cfg.manual.length} single event${
                  cfg.manual.length > 1 ? "s" : ""
                }.`
              : "Click an event lane on the timeline to add single events."}
          </span>
          {cfg.manual.length > 0 && (
            <Button
              variant="ghost"
              className="!h-6 !px-1.5"
              onClick={() => update((d) => void (d.manual = []))}
            >
              Clear
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function TrafficRow({
  src,
  tenants,
  onChange,
  onRemove,
}: {
  src: TrafficSource;
  tenants: { value: string; label: string }[];
  onChange: (s: TrafficSource) => void;
  onRemove: () => void;
}) {
  const setKind = (kind: TrafficSource["kind"]) => {
    if (kind === src.kind) return;
    if (kind === "burst")
      onChange({
        id: src.id,
        tenant: src.tenant,
        kind,
        at: 0,
        count: 10,
        spread: 0,
      });
    else if (kind === "steady")
      onChange({
        id: src.id,
        tenant: src.tenant,
        kind,
        from: 0,
        to: 20,
        every: 2,
      });
    else
      onChange({
        id: src.id,
        tenant: src.tenant,
        kind,
        from: 0,
        to: 20,
        rate: 0.5,
        seed: Math.floor(Math.random() * 1000) + 1,
      });
  };
  return (
    <div className="grid grid-cols-3 items-end gap-2 sm:grid-cols-[112px_112px_repeat(3,minmax(0,1fr))_28px]">
      <Field label="tenant">
        <Select
          ariaLabel="Tenant"
          value={src.tenant}
          options={tenants}
          onChange={(v) => onChange({ ...src, tenant: v })}
        />
      </Field>
      <Field label="pattern">
        <Select<TrafficSource["kind"]>
          ariaLabel="Pattern"
          value={src.kind}
          options={[
            { value: "burst", label: "Burst" },
            { value: "steady", label: "Steady" },
            { value: "random", label: "Random" },
          ]}
          onChange={setKind}
        />
      </Field>
      <div className="flex justify-end sm:order-last">
        <IconButton label="Remove traffic" onClick={onRemove}>
          <RiCloseLine className="h-4 w-4" />
        </IconButton>
      </div>
      {src.kind === "burst" && (
        <>
          <Field label="count">
            <NumberInput
              value={src.count}
              min={1}
              max={200}
              onChange={(v) => onChange({ ...src, count: Math.round(v) })}
            />
          </Field>
          <Field label="at">
            <NumberInput
              value={src.at}
              min={0}
              max={600}
              step={0.5}
              suffix="s"
              onChange={(v) => onChange({ ...src, at: v })}
            />
          </Field>
          <Field label="spread over">
            <NumberInput
              value={src.spread}
              min={0}
              max={600}
              step={0.5}
              suffix="s"
              onChange={(v) => onChange({ ...src, spread: v })}
            />
          </Field>
        </>
      )}
      {src.kind === "steady" && (
        <>
          <Field label="every">
            <NumberInput
              value={src.every}
              min={0.1}
              max={600}
              step={0.5}
              suffix="s"
              onChange={(v) => onChange({ ...src, every: v })}
            />
          </Field>
          <Field label="from">
            <NumberInput
              value={src.from}
              min={0}
              max={600}
              suffix="s"
              onChange={(v) => onChange({ ...src, from: v })}
            />
          </Field>
          <Field label="to">
            <NumberInput
              value={src.to}
              min={0}
              max={600}
              suffix="s"
              onChange={(v) => onChange({ ...src, to: v })}
            />
          </Field>
        </>
      )}
      {src.kind === "random" && (
        <>
          <Field label="per second">
            <NumberInput
              value={src.rate}
              min={0.05}
              max={20}
              step={0.1}
              onChange={(v) => onChange({ ...src, rate: v })}
            />
          </Field>
          <Field label="from">
            <NumberInput
              value={src.from}
              min={0}
              max={600}
              suffix="s"
              onChange={(v) => onChange({ ...src, from: v })}
            />
          </Field>
          <Field label="to">
            <NumberInput
              value={src.to}
              min={0}
              max={600}
              suffix="s"
              onChange={(v) => onChange({ ...src, to: v })}
            />
          </Field>
        </>
      )}
    </div>
  );
}

export function CodeView({ cfg }: { cfg: SimConfig }) {
  const code = generateCode(cfg);
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <pre className="m-0 max-h-[520px] overflow-auto rounded-lg bg-canvasBase p-3 font-mono text-[11.5px] leading-relaxed text-basis">
        <code>{code}</code>
      </pre>
      <IconButton
        label={copied ? "Copied" : "Copy code"}
        className="absolute right-2 top-2"
        onClick={() => {
          navigator.clipboard?.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
      >
        {copied ? (
          <RiCheckLine className="h-4 w-4" />
        ) : (
          <RiFileCopyLine className="h-4 w-4" />
        )}
      </IconButton>
    </div>
  );
}
