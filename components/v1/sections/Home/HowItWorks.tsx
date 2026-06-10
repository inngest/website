"use client";

import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CarouselArrow } from "@/components/v1/sections/shared/CarouselArrow";
import { AdvanceClick } from "@/components/v1/sections/shared/AdvanceClick";
import { motion } from "motion/react";
import { springs, tweens, V1_CYCLE_MS } from "@/utils/v1/springs";
import { cn } from "@/utils/v1/cn";

interface Step {
  number: string;
  title: string;
  body: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  /** Icon column width at desktop. */
  iconColWidth: number;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Start locally",
    body: "Start locally in one command. Install the SDK, define a function, and deploy alongside your existing app.",
    iconSrc: "/assets/v1/how-it-works/icon-1.svg",
    iconWidth: 192,
    iconHeight: 232,
    iconColWidth: 338,
  },
  {
    number: "02",
    title: "Run anywhere",
    body: "Deploy to your favorite cloud provider — serverless platforms, traditional servers, or anywhere else. If your app runs there, your Inngest functions can too.",
    iconSrc: "/assets/v1/how-it-works/icon-2.svg",
    iconWidth: 338,
    iconHeight: 136,
    iconColWidth: 338,
  },
  {
    number: "03",
    title: "Ship unbreakable code",
    body: "Write functions that know when to run, wait, fan-out, and throttle during any event, at any scale, anywhere.",
    iconSrc: "/assets/v1/how-it-works/icon-3.svg",
    iconWidth: 220,
    iconHeight: 247,
    iconColWidth: 220,
  },
];

const CARD_GAP_PX = 100;

// Embla's loop engine needs an off-screen buffer slide on each side of
// the visible window to wrap forward as you advance. With only the 3
// physical steps, the partially-visible "previous" card on the left IS
// the slide Embla must reposition to the right at the 3→1 seam, so it
// flashes then vanishes. Rendering a second copy (6 slides) gives the
// loop a spare off-screen slide to wrap instead, keeping the previous
// card put. Physical indices map back to the 3 logical steps via `% N`.
const LOOP_COPIES = 2;

export default function HowItWorks() {
  return (
    <section
      aria-label="How Inngest works"
      className="relative overflow-x-clip"
    >
      <Carousel />
    </section>
  );
}

function Carousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: false,
    // Embla "ticks" (~16ms each). 28 ≈ 460ms — matches the page's
    // other long horizontal motions.
    duration: 28,
  });
  // `active` tracks the physical slide index (0..slides.length-1);
  // `logicalActive` folds it back onto the 3 steps for the progress rail.
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const total = STEPS.length;
  const slides = Array.from(
    { length: total * LOOP_COPIES },
    (_, i) => STEPS[i % total]
  );
  const logicalActive = active % total;

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActive(emblaApi.selectedScrollSnap());
    const onPointerDown = () => setDragging(true);
    const onPointerUp = () => setDragging(false);
    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
    };
  }, [emblaApi]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "-10% 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const next = () => emblaApi?.scrollNext();
  const prev = () => emblaApi?.scrollPrev();

  return (
    <div
      ref={rootRef}
      className="mx-auto flex max-w-[1440px] flex-col gap-[41px] py-20 lg:gap-v1-stack-lg lg:py-40"
    >
      <AdvanceClick onAdvance={next} ariaLabel="Show next step" hideCursor>
        <div
          ref={emblaRef}
          className="touch-pan-y overflow-visible px-6 lg:px-[72px]"
        >
          {/* Spacing is `padding-right` on each slide wrapper, not CSS
              `gap` and not margin. `gap` collapses at Embla's loop-wrap
              seam (it only applies between flex siblings in their
              natural order), and margin doesn't count toward a slide's
              bounding rect so `align: 'start'` would offset the active
              Card by one gap. Padding lives inside the rect, so the
              active slide lands at viewport-content start AND Embla
              translates the wrap-target with a real gap to its left. */}
          <div
            className="flex select-none items-center"
            style={{ cursor: dragging ? "grabbing" : "grab" }}
          >
            {slides.map((step, i) => (
              <div
                key={i}
                className="w-full shrink-0 lg:w-auto"
                style={{ paddingRight: `${CARD_GAP_PX}px` }}
              >
                <Card step={step} active={i === active} />
              </div>
            ))}
          </div>
        </div>
      </AdvanceClick>
      <div className="px-6 lg:px-[72px]">
        <ProgressRail
          active={logicalActive}
          total={total}
          durationMs={V1_CYCLE_MS}
          running={inView && !dragging && total > 1}
          onPrev={prev}
          onNext={next}
          onAdvance={next}
        />
      </div>
    </div>
  );
}

function Card({ step, active }: { step: Step; active: boolean }) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 flex-row items-center gap-10 motion-safe:transition-opacity motion-safe:duration-300",
        "w-[360px] md:w-[410px] lg:w-auto lg:gap-[61px]",
        active ? "opacity-100" : "opacity-20"
      )}
    >
      <div
        className="flex shrink-0 items-center justify-center min-w-0 flex-1 lg:flex-none lg:w-[var(--icon-col)]"
        style={{
          "--icon-col": `${step.iconColWidth}px`,
          "--img-w": `${step.iconWidth}px`,
          "--img-h": `${step.iconHeight}px`,
        } as React.CSSProperties}
      >
        <motion.img
          src={step.iconSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          width={step.iconWidth}
          height={step.iconHeight}
          // Active stays at scale 1: center-origin scaling above 1
          // bleeds the icon past the slide's layout box and visibly
          // overflows the viewport's left edge. Inactive shrinks + drops
          // so the active one still pops by comparison.
          animate={{
            scale: active ? 1 : 0.88,
            y: active ? 0 : 6,
          }}
          transition={tweens.entry}
          style={{ transformOrigin: "center" }}
          className="block h-auto w-full max-w-[120px] lg:w-[var(--img-w)] lg:h-[var(--img-h)] lg:max-w-none"
        />
      </div>
      <div className="flex w-1/2 shrink-0 flex-col gap-[19px] lg:w-[368px] lg:gap-[14px]">
        <div className="flex w-[41px] items-center justify-between">
          {/* Active flips to accent-blue + CSS pulse so the
              "currently playing" affordance reads from across the page. */}
          <motion.span
            aria-hidden="true"
            animate={{ scale: active ? 1 : 0.7 }}
            transition={springs.bounce}
            className={cn(
              "size-3 motion-safe:transition-colors motion-safe:duration-200",
              active
                ? "bg-v1-accent-blue motion-safe:animate-pulse"
                : "bg-v1-frost",
            )}
          />
          <span className="text-v1-label-md uppercase text-v1-frost">
            {step.number}
          </span>
        </div>
        <div className="flex flex-col gap-3 lg:gap-[14px]">
          <h3 className="text-[24px] leading-[1.2] text-v1-frost lg:text-balance lg:text-v1-heading-card">{step.title}</h3>
          <p className="text-pretty text-[16px] leading-[1.2] tracking-[-0.01em] text-[#B3B3B3] lg:text-v1-body-lg-loose lg:tracking-normal">{step.body}</p>
        </div>
      </div>
    </div>
  );
}

function ProgressRail({
  active,
  total,
  durationMs,
  running,
  onPrev,
  onNext,
  onAdvance,
}: {
  active: number;
  total: number;
  durationMs: number;
  running: boolean;
  onPrev: () => void;
  onNext: () => void;
  onAdvance: () => void;
}) {
  const arrowBtn =
    "group inline-flex shrink-0 items-center justify-center rounded-full text-v1-frost motion-safe:transition-[background-color,color] motion-safe:duration-300 motion-safe:ease-v1-out hover:bg-v1-frost/[0.06] focus-visible:bg-v1-frost/[0.06]";
  const arrowSvg =
    "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-v1-out group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]";
  return (
    <div className="flex items-center gap-[13px] px-[13px]">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous step"
        className={arrowBtn}
      >
        <CarouselArrow className={`size-[31px] rotate-180 sm:size-10 ${arrowSvg}`} />
      </button>
      {/* Segmented rail — N separate 1 px bars with a 6 px gap
          between them, so the boundaries read as actual breaks in
          the line rather than tick marks drawn over a continuous
          bar. */}
      <div className="flex flex-1 gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="relative h-1 flex-1 overflow-hidden bg-v1-frost/20"
          >
            {i < active && (
              <div className="absolute inset-0 bg-v1-frost" />
            )}
            {i === active && running && (
              <div
                key={active}
                onAnimationEnd={onAdvance}
                className="absolute inset-0 origin-left bg-v1-frost motion-reduce:hidden"
                style={{
                  animation: `v1-carousel-progress ${durationMs}ms linear forwards`,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next step"
        className={arrowBtn}
      >
        <CarouselArrow className={`size-[31px] sm:size-10 ${arrowSvg}`} />
      </button>
    </div>
  );
}
