"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/v1/cn";
import {
  onCursorSpotlightMove,
  CURSOR_SPOTLIGHT_SEED,
} from "@/utils/v1/cursorFx";

/**
 * One row in a {@link useReelCarousel}-backed directory grid: button
 * shell + cursor-spotlight overlay + salmon dot (steel when inactive)
 * + pulse halo on the active row while the reel is auto-cycling.
 * Title/body content is passed via `children`.
 */
export interface ReelDirectoryRowProps {
  isActive: boolean;
  /**
   * True while the reel is auto-advancing — drives the active dot's
   * blur halo. Pass `false` to suppress the halo even when active.
   */
  cycling?: boolean;
  /**
   * Opt-in: render a persistent salmon line across the top of the active
   * row (instead of the pulse halo), shown whenever the row is active.
   * Used by the AI / Webhooks "What users are building" reel.
   */
  showProgress?: boolean;
  onSelect: () => void;
  /** Optional — wired to onPointerEnter + onFocus when provided. */
  onHoverEnter?: () => void;
  /** Optional — wired to onPointerLeave + onBlur when provided. */
  onHoverLeave?: () => void;
  /** Default true. Disables the cursor-spotlight radial overlay. */
  cursorSpotlight?: boolean;
  /** Override the default row class (padding/hover background). */
  className?: string;
  /** Override the dot anchor's height to align with a fluidly-scaled heading's cap line. */
  dotAnchorClassName?: string;
  /** Replace active-state classes on the 8px dot (default `bg-v1-accent-salmon`). */
  dotActiveClassName?: string;
  /**
   * Panel ID this row controls. When set, emits `aria-controls` +
   * `aria-current` (carousel semantics); otherwise emits `aria-pressed`
   * (toggle-button fallback for standalone callers).
   */
  ariaControls?: string;
  /** Content slot — typically a `<span flex flex-col>` of title + body. */
  children: ReactNode;
}

const DEFAULT_ROW_CLASS =
  "group/row relative isolate flex h-full w-full items-start gap-[10px] rounded-md px-[22px] py-[18px] text-left hover:bg-v1-frost/[0.035] focus-visible:bg-v1-frost/[0.035] motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-v1-out";

const PULSE_ANIMATION =
  "v1LifecyclePulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite";

export default function ReelDirectoryRow({
  isActive,
  cycling = false,
  showProgress = false,
  onSelect,
  onHoverEnter,
  onHoverLeave,
  cursorSpotlight = true,
  className,
  dotAnchorClassName,
  dotActiveClassName = "bg-v1-accent-salmon",
  ariaControls,
  children,
}: ReelDirectoryRowProps) {
  const ariaProps = ariaControls
    ? { "aria-controls": ariaControls, "aria-current": isActive as boolean }
    : { "aria-pressed": isActive };
  return (
    <button
      type="button"
      onClick={onSelect}
      onPointerMove={cursorSpotlight ? onCursorSpotlightMove : undefined}
      onPointerEnter={onHoverEnter}
      onPointerLeave={onHoverLeave}
      onFocus={onHoverEnter}
      onBlur={onHoverLeave}
      {...ariaProps}
      style={cursorSpotlight ? CURSOR_SPOTLIGHT_SEED : undefined}
      className={cn(
        DEFAULT_ROW_CLASS,
        // Persistent faint fill on the active row so it reads as
        // selected even when the cursor is elsewhere. One level below
        // the hover background; hover still wins while pointed at.
        isActive && "bg-v1-frost/[0.025]",
        className,
      )}
    >
      {cursorSpotlight && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-md opacity-0 group-hover/row:opacity-100 motion-safe:transition-opacity motion-safe:duration-[420ms]"
          style={{
            background:
              "radial-gradient(280px circle at var(--mx) var(--my), rgba(232, 234, 237, 0.07), transparent 65%)",
          }}
        />
      )}
      {/* Persistent salmon line marking the active row — shown whenever
          the row is active (no fill animation; the reel's auto-advance
          timing is unchanged). */}
      {showProgress && isActive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-2 top-0 block h-[2px] bg-v1-accent-salmon"
        />
      )}
      <span
        aria-hidden="true"
        className={cn(
          "relative flex h-[40px] shrink-0 items-center",
          dotAnchorClassName,
        )}
      >
        {isActive && cycling && !showProgress && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1 top-1/2 -ml-1.5 -mt-1.5 size-5 rounded-full bg-v1-accent-salmon/40 blur-[6px]"
            style={{ animation: PULSE_ANIMATION }}
          />
        )}
        <span
          className={cn(
            "relative size-2 motion-safe:transition-[background-color,transform] motion-safe:duration-300 motion-safe:ease-v1-out",
            isActive
              ? dotActiveClassName
              : "bg-v1-steel group-hover/row:translate-x-[3px] group-hover/row:bg-v1-accent-salmon group-focus-visible/row:translate-x-[3px] group-focus-visible/row:bg-v1-accent-salmon",
          )}
          style={
            isActive && cycling && !showProgress
              ? { animation: PULSE_ANIMATION }
              : undefined
          }
        />
      </span>
      {children}
    </button>
  );
}
