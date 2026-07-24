import { useEffect, useState } from "react";

/**
 * Returns true once `window.scrollY` passes `enter`, and false again only
 * after it drops back below `exit`.
 *
 * The gap between the two thresholds (hysteresis) prevents flicker when the
 * layout shift caused by toggling state would otherwise cross a single
 * threshold in both directions on each render — a common bug with sticky
 * headers that change height between states.
 *
 * Updates are coalesced via `requestAnimationFrame` so we only re-render at
 * most once per frame regardless of how often the browser fires `scroll`.
 *
 * @param enter scrollY at or above which the state becomes true.
 * @param exit  scrollY at or below which the state becomes false again.
 *              Defaults to `enter` (no hysteresis).
 */
export function useScrolledPast(enter: number, exit: number = enter): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let active = false;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      if (!active && y > enter) {
        active = true;
        setScrolled(true);
      } else if (active && y < exit) {
        active = false;
        setScrolled(false);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enter, exit]);

  return scrolled;
}
