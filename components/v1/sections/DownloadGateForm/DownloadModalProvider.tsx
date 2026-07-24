"use client";

import { createContext, useContext, useState } from "react";
import DownloadModal from "@/components/v1/sections/DownloadGateForm/DownloadModal";

// Context lets nested CTAs trigger the modal without prop-drilling
// the open handler through every section.
const DownloadModalContext = createContext<() => void>(() => {});
export const useOpenDownload = () => useContext(DownloadModalContext);

// Owns the modal open state and renders the modal as a sibling of the
// page content, so the page itself can stay a server component that just
// composes sections. Nested CTAs open the modal via useOpenDownload().
export default function DownloadModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <DownloadModalContext.Provider value={() => setOpen(true)}>
      {children}
      <DownloadModal open={open} onClose={() => setOpen(false)} />
    </DownloadModalContext.Provider>
  );
}
