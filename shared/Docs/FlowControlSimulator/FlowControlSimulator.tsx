"use client";

import {
  RiCheckLine,
  RiLinkM,
  RiPauseFill,
  RiPlayFill,
  RiRestartLine,
  RiSkipBackFill,
} from "@remixicon/react";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CONTROL_LABELS,
  conflictFor,
  MODEL_NOTES,
  simulate,
  type ControlId,
  type SimConfig,
} from "./engine";
import { fmtT, niceDomain } from "./derive";
import { cloneConfig, getPreset, PRESETS } from "./presets";
import { CodeView, FlowSettings, Steps, Traffic } from "./Controls";
import { Log } from "./Log";
import { Summary } from "./Summary";
import { RunTimeline } from "./Timeline";
import { MarbleDiagram } from "../FlowControlMarbles/Diagram";
import { MarbleLegend } from "../FlowControlMarbles/Legend";
import { buildModel } from "../FlowControlMarbles/model";
import { decodeState, encodeState, SIMULATOR_PATH } from "./share";
import { Button, IconButton, Select, Tabs } from "./ui";

/** Playback always covers the whole timeline in roughly this many seconds. */
const PLAYBACK_SECONDS = 20;

type Tab = "settings" | "traffic" | "steps" | "runs" | "log" | "code";

/** Output lanes shown before extra runs share one lane. */
const MAX_LANES = 10;

export function FlowControlSimulator({
  preset = "basic",
  presets,
  variant = "embed",
}: {
  /** Scenario to load first. */
  preset?: string;
  /** Limit the scenario picker to these ids. */
  presets?: string[];
  /** "page" uses the full content width and reads shared links. */
  variant?: "embed" | "page";
}) {
  const [presetId, setPresetId] = useState(getPreset(preset).id);
  const [cfg, setCfg] = useState<SimConfig>(() =>
    cloneConfig(getPreset(preset).config)
  );
  const [dirty, setDirty] = useState(false);
  const [tab, setTab] = useState<Tab>("settings");
  const [selectedRun, setSelectedRun] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (variant !== "page" || typeof window === "undefined") return;
    const s = new URLSearchParams(window.location.search).get("fc");
    const state = s ? decodeState(s) : null;
    if (state) {
      setPresetId(getPreset(state.p).id);
      setCfg(state.c);
      setDirty(true);
    }
  }, [variant]);

  const result = useMemo(() => simulate(cfg), [cfg]);
  const domain = useMemo(() => niceDomain(result), [result]);
  const model = useMemo(
    () =>
      buildModel(cfg, result, {
        domain,
        realDuration: PLAYBACK_SECONDS,
        alwaysQueue: true,
        maxLanes: MAX_LANES,
      }),
    [cfg, result, domain]
  );

  // Playback ------------------------------------------------------------------
  const [t, setT] = useState<number>(() =>
    niceDomain(simulate(getPreset(preset).config))
  );
  const [playing, setPlaying] = useState(false);
  const speed = domain / PLAYBACK_SECONDS;

  useEffect(() => {
    setT((cur) => Math.min(cur, domain));
  }, [domain]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      let done = false;
      setT((cur) => {
        const next = cur + dt * speed;
        if (next >= domain) {
          done = true;
          return domain;
        }
        return next;
      });
      if (done) setPlaying(false);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, domain]);

  const play = () => {
    if (t >= domain - 1e-6) setT(0);
    setPlaying(true);
  };

  const seek = useCallback((v: number) => {
    setPlaying(false);
    setT(v);
  }, []);

  // Config ----------------------------------------------------------------------
  const update = useCallback((fn: (d: SimConfig) => void) => {
    setCfg((cur) => {
      const next = cloneConfig(cur);
      fn(next);
      return next;
    });
    setDirty(true);
    setSelectedRun(null);
  }, []);

  const loadPreset = (id: string) => {
    const c = cloneConfig(getPreset(id).config);
    setPresetId(getPreset(id).id);
    setCfg(c);
    setDirty(false);
    setSelectedRun(null);
    setPlaying(false);
    setT(niceDomain(simulate(c)));
  };

  const addEvent = useCallback(
    (tenant: string, at: number) =>
      update((d) => void d.manual.push({ t: at, tenant })),
    [update]
  );
  const removeManual = useCallback(
    (i: number) => update((d) => void d.manual.splice(i, 1)),
    [update]
  );
  const selectRun = useCallback((id: number | null) => {
    setSelectedRun(id);
    if (id !== null) setTab("log");
  }, []);

  const copyLink = () => {
    const url = `${window.location.origin}${SIMULATOR_PATH}?fc=${encodeState(
      presetId,
      cfg
    )}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const current = getPreset(presetId);
  const presetOptions = PRESETS.filter(
    (p) => !presets || presets.includes(p.id)
  ).map((p) => ({
    value: p.id,
    label: p.title,
  }));

  const rootRef = useRef<HTMLDivElement>(null);
  const [rootW, setRootW] = useState(0);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setRootW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const twoCol = rootW >= 620;

  return (
    <div
      ref={rootRef}
      className={clsx(
        "not-prose my-10 flex flex-col gap-4 rounded-2xl bg-canvasSubtle p-4 leading-normal text-basis sm:p-6",
        // The page variant also widens the page's text to match; see
        // .docs-wide-page in globals.css.
        variant === "page" && "docs-wide-page lg:!mx-0 lg:!max-w-none"
      )}
    >
      {/* Header: fixed height so the timeline never moves. */}
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-56">
            <Select
              ariaLabel="Scenario"
              value={presetId}
              options={presetOptions}
              onChange={loadPreset}
            />
          </div>
          {dirty && (
            <Button
              variant="ghost"
              className="!h-7 !px-1.5"
              onClick={() => loadPreset(presetId)}
              title="Reset to the scenario's settings"
            >
              <RiRestartLine className="h-3.5 w-3.5" /> Reset
            </Button>
          )}
          <div className="flex-1" />
          <IconButton
            label={copied ? "Link copied" : "Copy a link to these settings"}
            onClick={copyLink}
          >
            {copied ? (
              <RiCheckLine className="h-4 w-4" />
            ) : (
              <RiLinkM className="h-4 w-4" />
            )}
          </IconButton>
        </div>
        <p className="m-0 line-clamp-2 min-h-[2.8em] text-xs leading-snug text-subtle">
          {current.summary}
          {current.tryThis && (
            <span className="text-muted"> Try: {current.tryThis}</span>
          )}
        </p>
      </div>

      <QuickToggles
        cfg={cfg}
        update={update}
        onOpenSettings={() => setTab("settings")}
      />

      <div className="flex flex-col gap-3 rounded-xl border border-subtle bg-canvasBase p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1">
            <Button
              variant="primary"
              onClick={playing ? () => setPlaying(false) : play}
              className="!w-[76px] justify-center"
            >
              {playing ? (
                <RiPauseFill className="h-3.5 w-3.5" />
              ) : (
                <RiPlayFill className="h-3.5 w-3.5" />
              )}
              {playing ? "Pause" : "Play"}
            </Button>
            <IconButton label="Back to start" onClick={() => seek(0)}>
              <RiSkipBackFill className="h-4 w-4" />
            </IconButton>
            <span className="ml-1 min-w-[88px] font-mono text-xs tabular-nums text-basis">
              {fmtT(t)} <span className="text-muted">/ {fmtT(domain)}</span>
            </span>
          </div>
        </div>

        {result.errors.length > 0 ? (
          <div className="rounded-md bg-error px-3 py-2 text-xs text-error">
            {result.errors.map((e) => (
              <p key={e} className="m-0">
                {e}
              </p>
            ))}
          </div>
        ) : (
          <>
            <MarbleDiagram
              model={model}
              t={t}
              label="Flow control simulation: events, flow control, and runs over time"
              onSeek={seek}
              onScrubStart={() => setPlaying(false)}
              interactive
              onAddEvent={addEvent}
              onRemoveManual={removeManual}
              onSelectRun={selectRun}
              selectedRun={selectedRun}
              showFuture
            />
            <MarbleLegend model={model} t={t} counts />
          </>
        )}
        <p className="m-0 text-[11px] text-muted">
          Click an event row to add an event, and click an added event to remove
          it. Click a run to see its log. Drag anywhere else to scrub.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Tabs<Tab>
          value={tab}
          onChange={setTab}
          tabs={[
            {
              value: "settings",
              label: (
                <>
                  <span className="sm:hidden">Flow</span>
                  <span className="hidden sm:inline">Flow control</span>
                </>
              ),
            },
            { value: "traffic", label: "Traffic" },
            { value: "steps", label: "Steps" },
            { value: "runs", label: "Runs" },
            { value: "log", label: "Log" },
            { value: "code", label: "Code" },
          ]}
        />
        {tab === "settings" && (
          <FlowSettings cfg={cfg} update={update} twoCol={twoCol} />
        )}
        {tab === "traffic" && <Traffic cfg={cfg} update={update} />}
        {tab === "steps" && <Steps cfg={cfg} update={update} />}
        {tab === "runs" && result.errors.length === 0 && (
          <div className="flex flex-col gap-4">
            <Summary result={result} />
            <RunTimeline
              result={result}
              cfg={cfg}
              domain={domain}
              t={t}
              onSeek={seek}
              selectedRun={selectedRun}
              onSelectRun={selectRun}
            />
          </div>
        )}
        {tab === "log" && (
          <Log
            result={result}
            t={t}
            playing={playing}
            selectedRun={selectedRun}
            onSelectRun={setSelectedRun}
            onSeek={seek}
          />
        )}
        {tab === "code" && <CodeView cfg={cfg} />}
      </div>

      <details className="text-[11px] text-muted">
        <summary className="cursor-pointer select-none">
          How this simulation works
        </summary>
        <ul className="mb-0 mt-1.5 flex flex-col gap-1 pl-4">
          {MODEL_NOTES.map((n) => (
            <li key={n} className="m-0">
              {n}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

const TOGGLE_GROUPS: {
  label: string;
  ids: (ControlId | "concurrency" | "keyQueues")[];
}[] = [
  { label: "1 · Before scheduling", ids: ["rateLimit", "batching"] },
  { label: "2 · When scheduling", ids: ["debounce", "singleton"] },
  {
    label: "3 · When executing",
    ids: ["concurrency", "throttle", "priority", "keyQueues", "startTimeout"],
  },
];

function concurrencySummary(cfg: SimConfig) {
  return cfg.concurrency.constraints
    .map((c) =>
      c.key === "tenant"
        ? `${c.limit}/tenant`
        : c.key === "shared"
        ? `${c.limit} shared`
        : `${c.limit}`
    )
    .join(" + ");
}

function QuickToggles({
  cfg,
  update,
  onOpenSettings,
}: {
  cfg: SimConfig;
  update: (fn: (d: SimConfig) => void) => void;
  onOpenSettings: () => void;
}) {
  const pill = (on: boolean, disabled: boolean) =>
    clsx(
      "inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-[11px] font-medium transition-colors",
      on
        ? "bg-matcha-600 text-white hover:bg-matcha-700 dark:bg-matcha-500 dark:text-carbon-1000 dark:hover:bg-matcha-400"
        : "bg-canvasBase text-subtle hover:bg-carbon-100 hover:text-basis dark:hover:bg-carbon-800",
      disabled &&
        "cursor-not-allowed opacity-40 hover:bg-canvasBase hover:text-subtle"
    );
  // Same width on and off, so toggling never re-wraps the row.
  const mark = (on: boolean) =>
    on ? (
      <RiCheckLine className="-ml-0.5 h-3 w-3 shrink-0" />
    ) : (
      <span className="-ml-0.5 flex h-3 w-3 shrink-0 items-center justify-center">
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-40" />
      </span>
    );
  return (
    <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-[136px_minmax(0,1fr)] sm:items-center sm:gap-x-3">
      {TOGGLE_GROUPS.map((g) => (
        <div key={g.label} className="contents">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {g.label}
          </div>
          <div
            className="flex flex-wrap gap-1"
            role="group"
            aria-label={g.label}
          >
            {g.ids.map((id) => {
              if (id === "concurrency") {
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed
                    title="Always on. Change the limit under Flow control below."
                    onClick={onOpenSettings}
                    className={pill(true, false)}
                  >
                    {mark(true)}
                    Step concurrency
                    <span className="font-normal opacity-80">
                      · {concurrencySummary(cfg)}
                    </span>
                  </button>
                );
              }
              if (id === "keyQueues") {
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={cfg.keyQueues}
                    title="Key-queue scheduling (Enterprise)"
                    onClick={() =>
                      update((d) => void (d.keyQueues = !d.keyQueues))
                    }
                    className={pill(cfg.keyQueues, false)}
                  >
                    {mark(cfg.keyQueues)}
                    Key queues
                  </button>
                );
              }
              const on = cfg[id].enabled;
              const conflict = !on ? conflictFor(cfg, id) : null;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  disabled={!!conflict}
                  title={
                    conflict ||
                    `${on ? "Turn off" : "Turn on"} ${CONTROL_LABELS[
                      id
                    ].toLowerCase()}`
                  }
                  onClick={() => update((d) => void (d[id].enabled = !on))}
                  className={pill(on, !!conflict)}
                >
                  {mark(on)}
                  {CONTROL_LABELS[id]}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
