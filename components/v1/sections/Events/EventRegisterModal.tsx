"use client";

import { useEffect, useState, type FormEvent } from "react";

import Button from "@/components/v1/Button";
import Modal from "@/components/v1/Modal";
import { TextField } from "@/components/v1/forms";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";

/**
 * Event registration modal — opened by the "Register for event" CTA on
 * the event detail hero.
 *  - overlay: black 75% + 4px blur
 *  - panel: black GradientFrame, 10px radius, 667px wide, 43px section
 *    gaps, pl-32 / pr-70 / py-44, content right-aligned
 *  - header: "REGISTER FOR EVENT:" eyebrow (Label/Md) + event title
 *    (Heading/Md), 24px gap
 *  - fields: 44px gaps; First/Last row at 20px; CircularXX 18px labels
 *    over the shared form inputs
 *  - footer: CANCEL (Label/Md text-only) + Register (Solid salmon)
 *
 * On submit the panel swaps to a confirmation state — "Thank you for
 * registering." + a note about the confirmation email + a Close
 * button — reusing the same GradientFrame
 * surface so the swap is seamless.
 *
 * The dialog mechanics (focus trap, ESC, scroll lock, scale-in) live in
 * the shared `Modal`; this component owns only the panel surface + form.
 *
 * TODO: POST to a real registration endpoint; for now it logs, then
 * shows the confirmation.
 */
export default function EventRegisterModal({
  open,
  onClose,
  eventTitle,
}: {
  open: boolean;
  onClose: () => void;
  eventTitle: string;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Reset the form + confirmation state once the close transition has
  // finished, so a re-open always starts on a fresh form. Deferring past
  // the ~200ms leave animation keeps the confirmation visible while the
  // panel fades, and avoids a 1-frame flash of the form on re-open.
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setSubmitted(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setCompany("");
    }, 250);
    return () => clearTimeout(t);
  }, [open]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: POST to a registration endpoint.
    console.log({ event: eventTitle, firstName, lastName, email, company });
    setSubmitted(true);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      label={`Register for event: ${eventTitle}`}
      maxWidthClassName="max-w-[667px]"
      // Overlay: black 75% + 4px backdrop blur.
      overlayClassName="bg-black/75 backdrop-blur-[4px]"
    >
      <GradientFrame
        variant="charcoal-horizontal"
        className="rounded-[10px] bg-v1-surfaceBase shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
      >
        {submitted ? (
          /* Confirmation — same panel padding as the form, but the
             content is centred with a 48px gap between the heading and
             the note, and 43px down to Close. */
          <div className="flex flex-col items-center gap-[43px] px-6 py-8 text-center text-v1-frost sm:py-[44px] sm:pl-8 sm:pr-[70px]">
            <div className="flex w-full flex-col items-center gap-12 text-white">
              <h2 className="text-v1-heading-md-cap">
                Thank you for registering.
              </h2>
              <p className="text-v1-body-lg max-w-[368px]">
                You will receive a confirmation email shortly with all the
                details about the event.
              </p>
            </div>
            <Button type="button" variant="accent" size="md" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          // 43px between the three sections; content hugs the right edge
          // (items-end) so the footer buttons sit right. Asymmetric
          // padding (pl-32 / pr-70 / py-44) at sm+; tighter, symmetric
          // padding on narrow screens.
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-end gap-[43px] px-6 py-8 text-v1-frost sm:py-[44px] sm:pl-8 sm:pr-[70px]"
          >
            {/* Header — eyebrow + event title. */}
            <div className="flex w-full flex-col items-start gap-6">
              <p className="text-v1-label-md uppercase text-white">
                Register for event:
              </p>
              <h2 className="text-v1-heading-md-cap text-white">
                {eventTitle}
              </h2>
            </div>

            {/* Fields — 44px between groups; First/Last share a 20px row. */}
            <div className="flex w-full flex-col gap-[44px]">
              <div className="flex flex-col gap-[44px] sm:flex-row sm:gap-[20px]">
                <div className="sm:flex-1">
                  <TextField
                    id="reg-first"
                    label="First Name"
                    required
                    value={firstName}
                    onChange={setFirstName}
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                  />
                </div>
                <div className="sm:flex-1">
                  <TextField
                    id="reg-last"
                    label="Last Name"
                    required
                    value={lastName}
                    onChange={setLastName}
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                  />
                </div>
              </div>
              <TextField
                id="reg-email"
                type="email"
                label="Email Address"
                required
                value={email}
                onChange={setEmail}
                placeholder="Enter your email address"
                autoComplete="email"
              />
              <TextField
                id="reg-company"
                label="Company (optional)"
                value={company}
                onChange={setCompany}
                placeholder="Enter company name"
                autoComplete="organization"
              />
            </div>

            {/* Footer — CANCEL (text-only) + Register (solid salmon),
              44px apart, right-aligned via the column's items-end. */}
            <div className="flex items-center gap-[44px]">
              <button
                type="button"
                onClick={onClose}
                className="text-v1-label-md uppercase text-v1-frost hover:text-v1-accent-salmon motion-safe:transition-colors"
              >
                Cancel
              </button>
              <Button type="submit" variant="accent" size="md">
                Register
              </Button>
            </div>
          </form>
        )}
      </GradientFrame>
    </Modal>
  );
}
