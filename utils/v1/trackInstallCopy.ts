/**
 * Analytics for the "npm install inngest" copy CTAs.
 *
 * Pushes one GTM dataLayer event per copy attempt, so GTM can forward it to
 * GA4 with a Custom Event trigger instead of sniffing clicks off CSS classes.
 * Every CTA passes an explicit `placement`, which is what tells the
 * homepage hero, the homepage DX section and the campaign pages apart.
 *
 * Adding a new copy CTA: add its placement to the union below and pass it
 * through — no GTM change needed.
 */
export type InstallCtaPlacement =
  | "homepage_hero"
  | "homepage_dx"
  | "long_run_hero"
  | "sf_long_run_hero"
  | "nyc_long_run_hero";

export const INSTALL_CTA_EVENT = "npm_install_copy";

export function trackInstallCopy({
  placement,
  command,
  status,
}: {
  placement: InstallCtaPlacement;
  command: string;
  status: "success" | "failed";
}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: INSTALL_CTA_EVENT,
      cta_placement: placement,
      cta_command: command,
      copy_status: status,
    });
  } catch (err) {
    console.warn("[trackInstallCopy] dataLayer push failed", err);
  }
}
