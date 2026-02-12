"use client";

import { useConsent } from "./useConsent";

export default function CookiePreferencesButton() {
  const { openPreferences } = useConsent();
  return (
    <button onClick={openPreferences} className="px-1 hover:underline">
      Cookie Preferences
    </button>
  );
}
