"use client";

import ContactForm from "src/components/ContactForm";
import { FORM_TYPE } from "src/components/ContactForm.constants";

/**
 * Single source of truth for content-download form behavior. Wraps
 * `ContactForm` with the `website/content.downloaded` event params so every
 * content download landing page (the dynamic `/content/[asset]` route AND
 * any bespoke static routes designed for specific assets) fires the same
 * Segment event with the same payload shape.
 *
 * If you need to change the event name, version, or form type, change it
 * here — never inline the params on a page.
 */

const EVENT_NAME = "website/content.downloaded";
const EVENT_VERSION = "2026-04-25.2";

export default function ContentDownloadForm({
  asset,
  button,
  redirectTo,
  successMessage,
  surveyLabel = "How did you hear about us?",
  className,
}: {
  /** Asset slug — must match a key in `shared/contentAssets`. */
  asset: string;
  /** Submit button copy. Defaults to "Download". */
  button?: string;
  /** Optional redirect after submit (e.g. to an interactive report page). */
  redirectTo?: string;
  /**
   * Inline success message rendered when there's no redirect. Falls back to
   * a generic content-download copy if not provided.
   */
  successMessage?: string;
  /** Override the "How did you hear about us?" input label. */
  surveyLabel?: string;
  className?: string;
}) {
  return (
    <ContactForm
      eventName={EVENT_NAME}
      eventVersion={EVENT_VERSION}
      formType={FORM_TYPE.CONTENT_DOWNLOAD}
      asset={asset}
      button={button ?? "Download"}
      redirectTo={redirectTo}
      successMessage={successMessage}
      surveyLabel={surveyLabel}
      className={className}
    />
  );
}
