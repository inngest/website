"use client";

import dynamic from "next/dynamic";

// Disable SSR in ComparisonTable, to prevent hydration errors. It requires windows info on accordions
const ComparisonTable = dynamic(
  () => import("src/app/pricing/ComparisonTable"),
  {
    ssr: false,
  }
);

export default function ComparisonTableWrapper({ plans, features, sections }) {
  return (
    <ComparisonTable plans={plans} features={features} sections={sections} />
  );
}
