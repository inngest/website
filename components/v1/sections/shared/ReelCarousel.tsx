"use client";

import {
  createContext,
  useContext,
  useId,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { reveals } from "@/utils/v1/reveals";
import { cn } from "@/utils/v1/cn";
import { ArrowPreviewButton } from "@/components/v1/sections/shared/ArrowPreviewButton";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import MobileReelNav from "@/components/v1/sections/shared/MobileReelNav";
import ReelDirectoryRow from "@/components/v1/sections/shared/ReelDirectoryRow";
import {
  useReelCarousel,
  type ReelCarousel as ReelCarouselController,
} from "@/components/v1/sections/shared/useReelCarousel";

export interface ReelItemBase {
  id: string;
}

interface ReelContextValue {
  items: readonly ReelItemBase[];
  getId: (item: ReelItemBase) => string;
  getTitle: (item: ReelItemBase) => string;
  controller: ReelCarouselController;
  panelId: string;
}

const ReelContext = createContext<ReelContextValue | null>(null);

function useReelContext(): ReelContextValue {
  const ctx = useContext(ReelContext);
  if (!ctx) {
    throw new Error(
      "ReelCarousel.* sub-components must be rendered inside <ReelCarousel>",
    );
  }
  return ctx;
}

interface ReelCarouselProps<T extends ReelItemBase> {
  items: readonly T[];
  getId?: (item: T) => string;
  getTitle: (item: T) => string;
  /**
   * Inject a pre-built controller when the IntersectionObserver should
   * anchor to your own `<section>` (attach `controller.sectionRef` to
   * it). Omit to let ReelCarousel create one and observe its wrapping
   * `<div>`.
   */
  controller?: ReelCarouselController;
  children: ReactNode;
}

function ReelCarousel<T extends ReelItemBase>({
  items,
  getId = (item) => item.id,
  getTitle,
  controller: externalController,
  children,
}: ReelCarouselProps<T>) {
  const internalController = useReelCarousel(items.length);
  const controller = externalController ?? internalController;
  const panelId = useId();

  const value: ReelContextValue = {
    items: items as readonly ReelItemBase[],
    getId: getId as (item: ReelItemBase) => string,
    getTitle: getTitle as (item: ReelItemBase) => string,
    controller,
    panelId,
  };

  const content = (
    <ReelContext.Provider value={value}>{children}</ReelContext.Provider>
  );

  // IntersectionObserver needs a DOM target. When no external controller
  // is provided, attach the internal one's ref to a wrapping div so
  // inView (and the cycling halo) actually fire.
  if (externalController) {
    return content;
  }
  return (
    <div
      ref={(el) => {
        (
          internalController.sectionRef as {
            current: HTMLElement | null;
          }
        ).current = el;
      }}
    >
      {content}
    </div>
  );
}

interface MobileNavProps {
  /** Singular noun for aria-labels, e.g. "primitive", "use case". */
  itemNoun: string;
  className?: string;
}

function MobileNav({ itemNoun, className }: MobileNavProps) {
  const { items, getTitle, controller } = useReelContext();
  const { active, next, prev } = controller;
  const prevIndex = (active - 1 + items.length) % items.length;
  const nextIndex = (active + 1) % items.length;
  return (
    <MobileReelNav
      activeTitle={getTitle(items[active])}
      prevTitle={getTitle(items[prevIndex])}
      nextTitle={getTitle(items[nextIndex])}
      itemNoun={itemNoun}
      onPrev={prev}
      onNext={next}
      className={className}
    />
  );
}

interface PanelProps<T extends ReelItemBase> {
  heightClass: string;
  paddingClass?: string;
  chevrons?: boolean;
  /** `"none"` skips the AnimatePresence crossfade — for static panels. */
  transition?: "crossfade" | "none";
  frameClassName?: string;
  children: (item: T) => ReactNode;
}

function Panel<T extends ReelItemBase>({
  heightClass,
  paddingClass = "p-6",
  chevrons = true,
  transition = "crossfade",
  frameClassName = "rounded-md",
  children,
}: PanelProps<T>) {
  const { items, getId, getTitle, controller, panelId } = useReelContext();
  const { active, next, prev } = controller;
  const prevIndex = (active - 1 + items.length) % items.length;
  const nextIndex = (active + 1) % items.length;
  const current = items[active] as T;

  return (
    <motion.div
      {...reveals.body}
      id={panelId}
      className="relative"
      role="group"
      aria-roledescription="carousel"
    >
      <GradientFrame
        variant="black"
        className={frameClassName}
        innerClassName="relative"
      >
        <div
          className={cn(
            "flex items-center justify-center",
            heightClass,
            paddingClass,
          )}
        >
          {transition === "crossfade" ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={getId(current)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex w-full items-center justify-center"
              >
                {children(current)}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex w-full items-center justify-center">
              {children(current)}
            </div>
          )}
        </div>
        {chevrons && (
          <>
            <ArrowPreviewButton
              direction="prev"
              title={getTitle(items[prevIndex])}
              onClick={prev}
            />
            <ArrowPreviewButton
              direction="next"
              title={getTitle(items[nextIndex])}
              onClick={next}
            />
          </>
        )}
      </GradientFrame>
    </motion.div>
  );
}

interface DirectoryRenderArg<T extends ReelItemBase> {
  item: T;
  isActive: boolean;
  index: number;
}

interface DirectoryProps<T extends ReelItemBase> {
  className?: string;
  columnsClass?: string;
  gapClass?: string;
  rowClassName?: string;
  dotAnchorClassName?: string;
  dotActiveClassName?: string;
  cursorSpotlight?: boolean;
  children: (arg: DirectoryRenderArg<T>) => ReactNode;
}

const DEFAULT_DIRECTORY_COLUMNS =
  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
const DEFAULT_DIRECTORY_GAP = "gap-x-4 gap-y-4";
const DEFAULT_DOT_ANCHOR_LG =
  "lg:h-[calc(clamp(1.25rem,1.75vw,1.625rem)*1.2)]";

function Directory<T extends ReelItemBase>({
  className,
  columnsClass = DEFAULT_DIRECTORY_COLUMNS,
  gapClass = DEFAULT_DIRECTORY_GAP,
  rowClassName,
  dotAnchorClassName = DEFAULT_DOT_ANCHOR_LG,
  dotActiveClassName,
  cursorSpotlight,
  children,
}: DirectoryProps<T>) {
  const { items, getId, getTitle, controller, panelId } = useReelContext();
  const { active, select, cycling, pause, resume, userTookControl } =
    controller;

  return (
    <>
      <ul
        className={cn(
          "grid list-none items-stretch pl-0",
          columnsClass,
          gapClass,
          className,
        )}
      >
        {items.map((rawItem, i) => {
          const item = rawItem as T;
          const isActive = i === active;
          return (
            <motion.li
              key={getId(item)}
              {...reveals.item(i)}
              className="h-full list-none"
            >
              <ReelDirectoryRow
                isActive={isActive}
                cycling={cycling}
                onSelect={() => select(i)}
                onHoverEnter={pause}
                onHoverLeave={resume}
                cursorSpotlight={cursorSpotlight}
                className={rowClassName}
                dotAnchorClassName={dotAnchorClassName}
                dotActiveClassName={dotActiveClassName}
                ariaControls={panelId}
              >
                {children({ item, isActive, index: i })}
              </ReelDirectoryRow>
            </motion.li>
          );
        })}
      </ul>
      {/* Announces user-driven slide changes only, not auto-cycle ticks
          (WAI guidance for auto-advancing carousels). */}
      <span aria-live="polite" className="sr-only">
        {userTookControl ? getTitle(items[active]) : ""}
      </span>
    </>
  );
}

ReelCarousel.MobileNav = MobileNav;
ReelCarousel.Panel = Panel;
ReelCarousel.Directory = Directory;

export default ReelCarousel;
