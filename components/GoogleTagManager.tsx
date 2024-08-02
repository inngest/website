"use client";
import { GoogleTagManager } from "@next/third-parties/google";

// Note - there is an issue with using this library component directly
// without wrapping in a client component, so we have to use this wrapper.
export default function GTM() {
  return <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />;
}
