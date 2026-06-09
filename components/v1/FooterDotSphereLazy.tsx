"use client";

import dynamic from "next/dynamic";

const FooterDotSphere = dynamic(
  () => import("@/components/v1/FooterDotSphere"),
  { ssr: false },
);

export default function FooterDotSphereLazy() {
  return <FooterDotSphere />;
}
