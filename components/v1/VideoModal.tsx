"use client";

import Modal from "@/components/v1/Modal";

/**
 * Reusable on-page YouTube lightbox. Built on the shared `Modal` shell
 * (Headless UI Dialog — focus trap, ESC/click-outside, scroll lock).
 *
 * Perf/UX rationale (vs. linking out to YouTube):
 *   - Keeps visitors on the page instead of bouncing them to
 *     youtube.com (better for conversion + engagement metrics).
 *   - The iframe is only rendered while `open` is true, and the Dialog
 *     unmounts its panel content on close — so nothing YouTube-related
 *     loads until the CTA is actually clicked, and playback stops the
 *     moment the modal closes. Zero impact on this page's initial
 *     load, LCP, or JS bundle.
 *   - Uses `youtube-nocookie.com`, which skips YouTube's
 *     tracking-cookie playback mode — lighter and more privacy-friendly
 *     than a standard embed.
 */
export default function VideoModal({
  open,
  onClose,
  videoId,
  title,
}: {
  open: boolean;
  onClose: () => void;
  /** YouTube video ID (the part after `youtu.be/` or `?v=`). */
  videoId: string;
  /** Accessible name for the dialog + iframe title. */
  title: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      label={title}
      maxWidthClassName="max-w-[960px]"
    >
      <div className="overflow-hidden rounded-[10px] border border-v1-frost/10 bg-v1-jetBlack shadow-2xl">
        <div className="relative aspect-video w-full">
          {open && (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
