import type { SimConfig } from "./engine";

export const SIMULATOR_PATH = "/docs/durable-execution/flow-control/simulator";

/** URL-safe base64 of a preset id and config, for `?fc=` share links. */
export function encodeState(presetId: string, cfg: SimConfig) {
  try {
    return btoa(JSON.stringify({ p: presetId, c: cfg }))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  } catch {
    return "";
  }
}

export function decodeState(s: string): { p: string; c: SimConfig } | null {
  try {
    const v = JSON.parse(atob(s.replace(/-/g, "+").replace(/_/g, "/")));
    if (v?.c && Array.isArray(v.c.steps) && Array.isArray(v.c.tenants)) {
      v.c.concurrency.enabled = true;
      if (!v.c.concurrency.constraints?.length) {
        v.c.concurrency.constraints = [
          { limit: 5, key: "none", scope: "fn", externalLoad: 0 },
        ];
      }
      return v;
    }
  } catch {
    // Ignore malformed links.
  }
  return null;
}

/** A link that opens the simulator page with this config loaded. */
export function simulatorHref(presetId: string, cfg: SimConfig) {
  return `${SIMULATOR_PATH}?fc=${encodeState(presetId, cfg)}`;
}
