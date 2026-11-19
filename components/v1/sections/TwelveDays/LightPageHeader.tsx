"use client";

import { useEffect, useRef } from "react";
import { clearHeroPanel, setHeroPanel } from "@/utils/v1/heroNav";

/**
 * Tells the site header this page starts on a light background, so its
 * transparent nav uses dark text instead of white. Renders nothing.
 */
export default function LightPageHeader() {
  const token = useRef<object>({});
  useEffect(() => {
    const t = token.current;
    setHeroPanel("ivory", t);
    return () => clearHeroPanel(t);
  }, []);
  return null;
}
