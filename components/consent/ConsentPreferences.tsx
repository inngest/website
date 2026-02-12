"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useConsent } from "./useConsent";
import type { ConsentCategories } from "./consentTypes";

export default function ConsentPreferences() {
  const { categories, isPreferencesOpen, setPreferencesOpen, updateCategories } =
    useConsent();
  const [localCategories, setLocalCategories] = useState<ConsentCategories>(categories);

  // Sync local state when the modal opens
  useEffect(() => {
    if (isPreferencesOpen) {
      setLocalCategories(categories);
    }
  }, [isPreferencesOpen, categories]);

  const handleSave = useCallback(() => {
    updateCategories(localCategories);
    setPreferencesOpen(false);
  }, [localCategories, updateCategories, setPreferencesOpen]);

  const handleClose = useCallback(() => {
    setPreferencesOpen(false);
  }, [setPreferencesOpen]);

  return (
    <AnimatePresence>
      {isPreferencesOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Cookie Preferences"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-stone-950 p-6 shadow-2xl"
          >
            <h2 className="text-lg font-semibold text-white">
              Cookie Preferences
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Choose which categories of cookies you&apos;d like to allow. Necessary
              cookies are always active as they are required for the site to function.
            </p>

            <div className="mt-6 space-y-4">
              <CategoryToggle
                label="Necessary"
                description="Required for the site to function properly."
                checked={true}
                disabled={true}
                onChange={() => {}}
              />
              <CategoryToggle
                label="Analytics"
                description="Help us understand how visitors interact with our site."
                checked={localCategories.analytics}
                onChange={(checked) =>
                  setLocalCategories((prev) => ({ ...prev, analytics: checked }))
                }
              />
              <CategoryToggle
                label="Marketing"
                description="Used for session replay and detailed behavior analysis."
                checked={localCategories.marketing}
                onChange={(checked) =>
                  setLocalCategories((prev) => ({ ...prev, marketing: checked }))
                }
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-stone-950 transition-colors hover:bg-gray-200"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CategoryToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-white/10 p-3">
      <div className="mr-4">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={`${label} cookies`}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          disabled
            ? "cursor-not-allowed bg-green-700/50"
            : checked
            ? "cursor-pointer bg-green-600"
            : "cursor-pointer bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
