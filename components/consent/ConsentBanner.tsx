"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useConsent } from "./useConsent";
import ConsentPreferences from "./ConsentPreferences";

export default function ConsentBanner() {
  const {
    hasConsented,
    region,
    acceptAll,
    rejectAll,
    openPreferences,
  } = useConsent();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!hasConsented) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [hasConsented]);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="mx-auto max-w-3xl rounded-lg border border-white/10 bg-stone-950/95 p-4 shadow-2xl backdrop-blur-sm md:p-6">
              {region === "eu" ? (
                <EUBanner
                  onAcceptAll={acceptAll}
                  onRejectAll={rejectAll}
                  onCustomize={openPreferences}
                />
              ) : region === "ca" ? (
                <CABanner
                  onAcceptAll={acceptAll}
                  onDoNotSell={rejectAll}
                />
              ) : (
                <OtherBanner onDismiss={acceptAll} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConsentPreferences />
    </>
  );
}

function EUBanner({
  onAcceptAll,
  onRejectAll,
  onCustomize,
}: {
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomize: () => void;
}) {
  return (
    <>
      <p className="text-sm text-gray-300">
        We use cookies and similar technologies to improve your experience, analyze
        traffic, and for marketing purposes. You can choose which categories to
        allow.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={onAcceptAll}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-stone-950 transition-colors hover:bg-gray-200"
        >
          Accept All
        </button>
        <button
          onClick={onRejectAll}
          className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
        >
          Reject All
        </button>
        <button
          onClick={onCustomize}
          className="rounded-md px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:text-white"
        >
          Customize
        </button>
      </div>
    </>
  );
}

function CABanner({
  onAcceptAll,
  onDoNotSell,
}: {
  onAcceptAll: () => void;
  onDoNotSell: () => void;
}) {
  return (
    <>
      <p className="text-sm text-gray-300">
        We use cookies and similar technologies to improve your experience and
        analyze traffic. By continuing to browse, you agree to our use of cookies.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={onAcceptAll}
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-stone-950 transition-colors hover:bg-gray-200"
        >
          OK
        </button>
        <button
          onClick={onDoNotSell}
          className="text-sm text-gray-400 underline transition-colors hover:text-white"
        >
          Do Not Sell or Share My Personal Information
        </button>
      </div>
    </>
  );
}

function OtherBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-gray-300">
        We use cookies to improve your experience and analyze traffic.
      </p>
      <button
        onClick={onDismiss}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium text-stone-950 transition-colors hover:bg-gray-200"
      >
        OK
      </button>
    </div>
  );
}
