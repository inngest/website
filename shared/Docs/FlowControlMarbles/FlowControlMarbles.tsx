"use client";

import {
  RiArrowRightUpLine,
  RiPauseFill,
  RiPlayFill,
  RiRestartLine,
} from "@remixicon/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { simulate } from "../FlowControlSimulator/engine";
import { simulatorHref } from "../FlowControlSimulator/share";
import { MarbleDiagram } from "./Diagram";
import { MarbleLegend } from "./Legend";
import { EPS, buildModel } from "./model";
import { getMarbleScenario } from "./scenarios";

const END_HOLD_MS = 2200;

/** Loops while on screen. With reduced motion, rests on the final state. */
export function useLoop(domain: number, realDuration: number) {
  const rootRef = useRef<HTMLElement>(null);
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);

  const seek = useCallback((v: number) => {
    tRef.current = v;
    setT(v);
  }, []);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
      seek(domain);
    }
  }, [domain, seek]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) return;
    let raf = 0;
    let last = performance.now();
    let holdUntil = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      let v = tRef.current;
      if (v >= domain - EPS) {
        if (!holdUntil) holdUntil = now + END_HOLD_MS;
        else if (now >= holdUntil) {
          holdUntil = 0;
          v = 0;
        }
      } else {
        v = Math.min(domain, v + (dt * domain) / realDuration);
      }
      if (v !== tRef.current) seek(v);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, visible, domain, realDuration, seek]);

  const toggle = () => {
    if (!playing && tRef.current >= domain - EPS) seek(0);
    setPlaying((p) => !p);
  };
  const replay = () => {
    seek(0);
    setPlaying(true);
  };
  return { rootRef, t, playing, setPlaying, seek, toggle, replay };
}

/**
 * An animated marble diagram for one docs scenario, driven by the flow
 * control simulator's engine.
 */
export function FlowControlMarbles({ scenario: id }: { scenario: string }) {
  const scenario = getMarbleScenario(id);
  const model = useMemo(
    () =>
      scenario
        ? buildModel(
            scenario.config,
            simulate(scenario.config),
            scenario.options
          )
        : null,
    [scenario]
  );
  const { rootRef, t, playing, setPlaying, seek, toggle, replay } = useLoop(
    model?.domain ?? 10,
    model?.realDuration ?? 8
  );

  if (!scenario || !model) {
    return process.env.NODE_ENV === "development" ? (
      <p className="text-error">Unknown flow control scenario: {id}</p>
    ) : null;
  }

  return (
    <figure
      ref={rootRef}
      className="not-prose my-8 flex flex-col gap-3 rounded-xl bg-canvasSubtle p-3 leading-normal text-basis sm:p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        {scenario.code.map((c) => (
          <code
            key={c}
            className="min-w-0 max-w-full truncate rounded-md bg-canvasBase px-2 py-1 font-mono text-[11px] text-basis ring-1 ring-inset ring-carbon-200 dark:ring-carbon-700 sm:text-xs"
          >
            {c}
          </code>
        ))}
        <div className="ml-auto flex items-center gap-0.5">
          <span
            className="mr-1 w-10 text-right font-mono text-[11px] tabular-nums text-muted"
            aria-hidden
          >
            {`${t.toFixed(1)}s`}
          </span>
          <ControlButton label={playing ? "Pause" : "Play"} onClick={toggle}>
            {playing ? (
              <RiPauseFill className="h-3.5 w-3.5" />
            ) : (
              <RiPlayFill className="h-3.5 w-3.5" />
            )}
          </ControlButton>
          <ControlButton label="Replay" onClick={replay}>
            <RiRestartLine className="h-3.5 w-3.5" />
          </ControlButton>
          <a
            href={simulatorHref(scenario.preset, scenario.config)}
            className="ml-1 inline-flex h-7 items-center gap-0.5 rounded-md px-1.5 text-[11px] font-medium text-muted transition-colors hover:bg-canvasMuted hover:text-basis"
            title="Open this scenario in the flow control simulator"
          >
            Simulator
            <RiArrowRightUpLine className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="rounded-lg bg-canvasBase px-2 py-2 sm:px-3">
        <MarbleDiagram
          model={model}
          t={t}
          label={scenario.caption}
          onSeek={seek}
          onScrubStart={() => setPlaying(false)}
        />
      </div>

      <figcaption className="flex flex-col gap-2">
        <MarbleLegend model={model} />
        <p className="m-0 text-xs leading-relaxed text-subtle">
          {scenario.caption}
        </p>
      </figcaption>
    </figure>
  );
}

export function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-canvasMuted hover:text-basis"
    >
      {children}
    </button>
  );
}
