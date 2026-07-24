import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query via `useSyncExternalStore` — React
 * 18+'s primitive for external stores, with SSR + concurrent-mode
 * safety the older `useState + useEffect` pattern lacks. SSR snapshot
 * is `false` so desktop-only branches stay unmounted until the client
 * confirms — safe direction for layout shift and asset loading.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
