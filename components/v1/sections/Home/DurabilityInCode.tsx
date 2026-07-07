"use client";

import { useState } from "react";
import ScaleInstantly from "./ScaleInstantly";
import {
  type DurabilityTabId,
  DEFAULT_DURABILITY_TAB,
} from "./durabilityTabs";

/**
 * Owns the shared selection for the "Durability belongs in code" section.
 * The three feature cards render as a tablist inside ScaleInstantly's
 * container, directly above the content they drive; selecting a card
 * swaps the panel's intro copy, dashboard video, and capability tiles.
 * "Retries & Reliability" is selected on load.
 */
export default function DurabilityInCode() {
  const [activeTab, setActiveTab] =
    useState<DurabilityTabId>(DEFAULT_DURABILITY_TAB);

  return <ScaleInstantly activeTab={activeTab} onSelect={setActiveTab} />;
}
