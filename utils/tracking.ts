import { getPageRef } from "@/utils/v1/refHandoff";

export const trackPageView = (url: string) => {
  if (typeof window.Inngest === "undefined") {
    console.warn("Inngest is not initialized");
    return;
  }

  window.Inngest.event({
    name: "website/page.viewed",
    data: {
      first_touch: false,
    },
    v: "2022-12-27.1",
  });

  // NOTE - Google Analytics is captured via Google Tag Manager's listening to the History API
};

export const trackDemoView = () => {
  // URL `?ref=` first, then a ref handed off by a tracked link click.
  const ref = getPageRef()?.ref ?? null;

  if (typeof window.Inngest === "undefined") {
    console.warn("Inngest is not initialized");
    return;
  }

  window.Inngest.event({
    name: "website/demo.viewed",
    data: {
      ref,
    },
  });
};
