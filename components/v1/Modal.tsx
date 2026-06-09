"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { type ReactNode } from "react";

import { cn } from "@/utils/v1/cn";

/**
 * Shared v1 modal shell. Built on Headless UI's `Dialog`, so it gets
 * focus trap, focus return, ESC-to-close, click-outside, and body
 * scroll lock for free (matching the MobileMenu drawer) — none of which
 * the previous hand-rolled modals had.
 *
 * It owns only the *mechanics + chrome*: the dimmed/blurred backdrop and
 * a centred, scrollable, scale-in panel positioner. The caller supplies
 * the visible panel surface (e.g. a `GradientFrame`) as `children`, so
 * each modal keeps its own look. Overlay styling is overridable via
 * `overlayClassName` to preserve per-modal designs.
 */
export default function Modal({
  open,
  onClose,
  label,
  children,
  maxWidthClassName = "max-w-[640px]",
  overlayClassName = "bg-v1-jetBlack/70 backdrop-blur-sm",
}: {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog (rendered as an sr-only title). */
  label: string;
  children: ReactNode;
  /** Tailwind max-width for the panel positioner. */
  maxWidthClassName?: string;
  /** Backdrop fill/blur — override to match a specific modal's design. */
  overlayClassName?: string;
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50" transition>
      <DialogBackdrop
        transition
        className={cn(
          "fixed inset-0 data-[closed]:opacity-0 motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-v1-out",
          overlayClassName,
        )}
      />

      {/* Scroll container — top-aligned on short/narrow screens so tall
          forms can scroll, centred from sm up. */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center p-4 sm:items-center sm:p-[10px]">
          <DialogPanel
            transition
            className={cn(
              "relative w-full data-[closed]:scale-[0.97] data-[closed]:opacity-0 motion-safe:transition motion-safe:duration-200 motion-safe:ease-v1-out",
              maxWidthClassName,
            )}
          >
            <DialogTitle className="sr-only">{label}</DialogTitle>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
