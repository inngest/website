"use client";

import { useContext } from "react";
import { ConsentContext, type ConsentContextValue } from "./ConsentContext";

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}
