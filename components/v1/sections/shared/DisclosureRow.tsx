"use client";

import {
  useId,
  type CSSProperties,
  type ElementType,
  type PointerEventHandler,
  type ReactNode,
} from "react";
import { cn } from "@/utils/v1/cn";

export interface DisclosureRowProps {
  /** Controlled open state — owned by the parent so a list of rows can
   *  enforce single-open semantics. */
  isOpen: boolean;
  onToggle: () => void;
  /** Trigger content — typically an inline disclosure dot + a title
   *  span. The wrapping <button> (with its aria wiring) is supplied. */
  trigger: ReactNode;
  /** Collapsible body content, rendered inside the clip region. */
  children: ReactNode;
  /** Wrapper element. Pass `"li"` inside a `<ul>` accordion; defaults
   *  to `"div"` (e.g. when each row is wrapped in its own `motion.li`). */
  as?: ElementType;
  /** Wrapper className — owns all visual styling: padding, rounding,
   *  hover/active background, the `group/*` hook, etc. */
  className?: string;
  /** Trigger `<button>` className — gap, vertical padding, focus. */
  triggerClassName?: string;
  /** Inner body box className — the padded content box inside the clip. */
  bodyClassName?: string;
  /** Optional decorative overlay (e.g. a cursor-spotlight sheen span)
   *  rendered first so it sits behind the trigger/body content. It's
   *  `absolute`, so `className` must establish a positioning context
   *  (the styled `AccordionItem` supplies `relative isolate`). */
  overlay?: ReactNode;
  /** Forwarded to the wrapper — used for the cursor-spotlight FX. */
  style?: CSSProperties;
  /** Forwarded to the wrapper — used for the cursor-spotlight FX. */
  onPointerMove?: PointerEventHandler<HTMLElement>;
}

/**
 * Single-open disclosure row — the shared *mechanics* behind the v1
 * accordions, with no visual opinions of its own. It owns:
 *
 *  - a11y wiring: the trigger `<button>` (`aria-expanded` /
 *    `aria-controls`) and the body `region` (`aria-labelledby`), with
 *    ids derived from `useId()` so multiple instances never collide;
 *  - the collapse animation: the `grid-rows 0fr↔1fr` + opacity trick,
 *    with a `min-h-0 overflow-hidden` inner clip.
 *
 * Everything visual — wrapper element/padding/background, the
 * disclosure dot, title typography, body styling — is supplied by the
 * caller via the slots + `className` props, so each consumer keeps its
 * own look while sharing the boilerplate that's easy to get wrong.
 *
 * Consumers: Contact `TopicItem`, AI/Faq `FaqRow` (and the FAQ pages
 * that reuse it).
 */
export default function DisclosureRow({
  isOpen,
  onToggle,
  trigger,
  children,
  as: Wrapper = "div",
  className,
  triggerClassName,
  bodyClassName,
  overlay,
  style,
  onPointerMove,
}: DisclosureRowProps) {
  const panelId = `disclosure-panel-${useId()}`;
  return (
    <Wrapper className={className} style={style} onPointerMove={onPointerMove}>
      {overlay}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          "relative flex w-full items-start text-left",
          triggerClassName,
        )}
      >
        {trigger}
      </button>

      {/* grid-rows 0fr→1fr animates to/from auto height while the inner
          min-h-0 overflow-hidden clips the body during the transition.
          `inert` when closed pulls the clipped content out of the tab
          order + a11y tree (the grid trick keeps it rendered, so without
          this a screen reader would read every collapsed row). No
          `role="region"` — the trigger's aria-expanded/controls already
          conveys the disclosure, and a region per row would flood the
          landmark list past the ~6 the APG recommends. */}
      <div
        id={panelId}
        inert={!isOpen}
        className={cn(
          "grid motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-[320ms] motion-safe:ease-v1-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={bodyClassName}>{children}</div>
        </div>
      </div>
    </Wrapper>
  );
}
