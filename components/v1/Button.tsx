"use client";

import { Slot } from "@radix-ui/react-slot";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/utils/v1/cn";
import { useRadialBleed } from "@/utils/v1/useRadialBleed";
import {
  onCursorSpotlightMove,
  CURSOR_SPOTLIGHT_SEED,
} from "@/utils/v1/cursorFx";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "secondaryLight"
  | "accent"
  | "pill";
export type ButtonSize = "sm" | "md" | "lg" | "xl";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Wider horizontal padding for higher visual weight. */
  wide?: boolean;
  className?: string;
  children: ReactNode;
}

type NativeButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    asChild?: false;
  };

/**
 * shadcn-style escape hatch — when `asChild` is true the Button
 * doesn't render its own element; it merges its classes and event
 * handlers onto the single React child (via Radix `Slot`). Used by
 * the sibling `ButtonLink` component to render a Next `<Link>`
 * styled as a Button, and available for anything else the caller
 * wants Button-styled (`<a target>`, Radix triggers, mailto/tel).
 *
 * Example:
 *   <Button asChild variant="primary" size="xl">
 *     <a href="mailto:hi@example.com">Email us</a>
 *   </Button>
 */
type AsChildButtonProps = BaseProps & {
  asChild: true;
};

export type ButtonProps = NativeButtonProps | AsChildButtonProps;

// No `transition-*` on the base — each variant declares its own
// transition list via `HOVER_TRANSITION`. `font-v1Label` matches
// the header nav items so every CTA on the site shares one
// typographic voice with the chrome.
const BASE_CLASSES =
  "group/btn relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md uppercase font-v1Label font-semibold tracking-[0.05rem]";

// v1 brand button scale — height grows monotonically:
//   sm  → 12 px label · 40 px height · 144 min-W · 20 px pad
//         (compact CTA — header nav, dense surfaces)
//   md  → 12 px label · 52 px height · 154 min-W · 20 px pad
//         (DEFAULT — pricing cards, in-page CTAs, the brand baseline)
//   lg  → 14 px label · 60 px height · 168 min-W · 24 px pad
//         (larger, prominent CTA)
//   xl  → 16 px label · 72 px height · 184 min-W · 28 px pad
//         (hero / promo CTAs)
// The `wide` modifier still bumps horizontal pad to 28 px on top of
// any size for higher visual weight.
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-[12px] h-8 min-w-[100px] px-5",
  md: "text-[12px] h-[42px] min-w-[124px] px-5",
  lg: "text-[14px] h-[60px] min-w-[168px] px-6",
  xl: "text-[16px] h-[72px] min-w-[184px] px-7",
};

// Hover treatment by fill colour:
//   * white  (primary, pill) → flood salmon on hover
//   * orange (accent)        → no change on hover
//   * white  outline (secondary) → flood salmon on hover
//
// The frost-ring variants share `.v1-cta-frost-ring` (defined in
// `styles/v1-animations.css`) which owns the inset shadow + a
// direction-asymmetric transition: ring snaps OFF fast on hover-in
// and stays gone until AFTER the bg has finished transitioning
// back on hover-out — kills the faint white-edge flash users were
// seeing when the ring's box-shadow interpolated over a still
// salmon-tinged bg.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-v1-frost text-v1-jetBlack v1-cta-frost-ring hover:bg-v1-accent-salmon hover:text-v1-frost",
  secondary:
    "text-v1-frost v1-cta-frost-ring hover:bg-v1-accent-salmon hover:text-v1-frost",
  // `secondary` recoloured for light surfaces: ink text + ink ring at
  // rest (the frost ring is invisible on ivory), same salmon flood on
  // hover. Colours only — geometry and hover behaviour are identical.
  secondaryLight:
    "text-v1-carbon-400 v1-cta-ink-ring hover:bg-v1-accent-salmon hover:text-v1-frost",
  // Accent: salmon-200 at rest, salmon-300 (~12% darker) on hover.
  // Cleaner than shifting hue or adding a glow — same color family,
  // just deepened. Standard CTA hover pattern.
  accent:
    "bg-v1-accent-salmon text-v1-frost hover:bg-v1-accent-salmon-dark motion-safe:transition-colors motion-safe:duration-200",
  pill: "bg-v1-frost text-v1-jetBlack v1-cta-frost-ring hover:bg-v1-accent-salmon hover:text-v1-frost",
};

// Radial bleed mechanism retired — buttons flood via a clean
// background-colour hover transition. Type kept so the consumer
// path (ancestor proximity hand-off) stays compileable; no variant
// opts in any more.
interface BleedConfig {
  fillColor: string;
  filledClass: string;
}

const BLEED: Partial<Record<ButtonVariant, BleedConfig>> = {};

// Hover text-slide intentionally disabled — render the label
// statically. Border / colour / scale hover affordances on the
// button itself still fire; only the dual-label flip is gone.
function ButtonText({ children }: { children: ReactNode }) {
  return (
    <span className="relative z-10 inline-flex items-center leading-[1]">
      {children}
    </span>
  );
}

/**
 * Cursor-tracked spotlight overlay — applied to any button that
 * shows salmon (either at rest via `accent`, or on hover via the
 * flood). Same vocabulary as the FeatureCards spotlight: a soft
 * radial gradient that follows the pointer via `--mx` / `--my` and
 * fades in on group-hover. Brightens the salmon fill without
 * changing its colour.
 */
// Cursor-tracked spotlight retired — buttons now flood salmon via a
// clean background-colour hover transition, with no drop shadow. Kept
// as a no-op so the existing call sites don't need to change.
function AccentSpotlight() {
  return null;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      wide = false,
      className,
      children,
      ...rest
    },
    forwardedRef
  ) {
    const cfg = BLEED[variant];
    // Every variant ends up salmon eventually — accent is salmon at
    // rest, primary / secondary / pill flood salmon on hover. They
    // ALL get the cursor-tracked highlight so the orange surface
    // reads the same regardless of which variant produced it.
    const showSpotlight = true;
    const internalRef = useRef<HTMLElement | null>(null);
    const { filled, bleedStyle, bleedAt, retract } = useRadialBleed(
      internalRef,
      cfg?.fillColor ?? "transparent"
    );

    // Ancestor proximity hand-off (AdvanceClick, PrimitiveList) can
    // fire `bleed-in` / `bleed-out` to start the fill before the
    // cursor reaches the button.
    useEffect(() => {
      if (!cfg) return;
      const el = internalRef.current;
      if (!el) return;
      const onBleedIn = (ev: Event) => {
        const ce = ev as CustomEvent<{ x: number; y: number }>;
        bleedAt(ce.detail.x, ce.detail.y);
      };
      const onBleedOut = () => retract();
      el.addEventListener("bleed-in", onBleedIn as EventListener);
      el.addEventListener("bleed-out", onBleedOut as EventListener);
      return () => {
        el.removeEventListener("bleed-in", onBleedIn as EventListener);
        el.removeEventListener("bleed-out", onBleedOut as EventListener);
      };
    }, [cfg, bleedAt, retract]);

    // Ref accepts any HTMLElement because `asChild` mode can resolve
    // to whatever element the caller passes (Link → anchor, a, Radix
    // trigger, etc.). The forwarded ref is typed as HTMLButtonElement
    // since that's the default render; consumers using asChild with a
    // non-button child should narrow the type at the call site.
    const setRefs = useCallback(
      (el: HTMLElement | null) => {
        internalRef.current = el;
        if (typeof forwardedRef === "function") {
          forwardedRef(el as HTMLButtonElement | null);
        } else if (forwardedRef) {
          (
            forwardedRef as React.RefObject<HTMLButtonElement | null>
          ).current = el as HTMLButtonElement | null;
        }
      },
      [forwardedRef]
    );

    const merged = cn(
      BASE_CLASSES,
      SIZE_CLASSES[size],
      VARIANT_CLASSES[variant],
      cfg && "motion-safe:transition-[color] motion-safe:duration-[360ms] motion-safe:ease-v1-out",
      wide && "!px-7",
      cfg && filled && cfg.filledClass,
      className
    );

    const handlers = cfg
      ? {
          onPointerEnter: (e: PointerEvent<HTMLElement>) =>
            bleedAt(e.clientX, e.clientY),
          onPointerLeave: () => retract(),
        }
      : showSpotlight
        ? {
            onPointerMove: onCursorSpotlightMove,
          }
        : {};

    // Marker for proximity-based ancestor hand-off (see useEffect).
    const bleedAttr = cfg ? { "data-bleed-button": "" } : {};

    const style = cfg
      ? bleedStyle
      : showSpotlight
        ? (CURSOR_SPOTLIGHT_SEED as React.CSSProperties)
        : undefined;

    // `asChild`: Radix `Slot` merges Button's chrome (classes, style,
    // handlers, ref) onto the single child element rather than rendering
    // its own wrapper. The caller's child becomes the rendered element —
    // useful for cases the `href` shortcut can't cover: external `<a>`
    // with `target`/`rel`, Radix triggers, mailto/tel, etc.
    //
    // Slot doesn't support wrapping the child with extra content, so
    // the spotlight overlay and ButtonText span don't apply in this
    // mode — the caller owns the inside.
    if ("asChild" in rest && rest.asChild) {
      const { asChild: _asChild, ...rootProps } = rest as AsChildButtonProps;
      void _asChild;
      return (
        <Slot
          ref={setRefs as React.Ref<HTMLElement>}
          className={merged}
          style={style}
          {...bleedAttr}
          {...handlers}
          {...rootProps}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={setRefs as React.Ref<HTMLButtonElement>}
        type={(rest as NativeButtonProps).type ?? "button"}
        className={merged}
        style={style}
        {...bleedAttr}
        {...handlers}
        {...(rest as NativeButtonProps)}
      >
        {showSpotlight && <AccentSpotlight />}
        <ButtonText>{children}</ButtonText>
      </button>
    );
  }
);

export default Button;
