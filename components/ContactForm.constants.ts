// Form-type constants shared between ContactForm (a "use client" component)
// and the Server Components that render it (e.g. landing pages, /contact, /yc).
//
// IMPORTANT: This file deliberately has no "use client" directive. FORM_TYPE
// previously lived in ContactForm.tsx, but importing constants from a "use
// client" module into a Server Component can cause the import to resolve to
// `undefined` at render time, which silently broke the GTM dataLayer event
// name lookup (`event: undefined`) on /contact, /yc, /landing/ai, and
// /compare-to-temporal.
//
// Keep FORM_TYPE here so both Server and Client Components can import it
// reliably.
//
// Check the Notion tracking plan for event names and schemas associated with
// each form type.
export const FORM_TYPE = {
  SALES_LEAD_FORM: "sales_lead",
  YC_LEAD_FORM: "yc_lead",
  CONTENT_DOWNLOAD: "content_download",
} as const;

export type FormType = (typeof FORM_TYPE)[keyof typeof FORM_TYPE];
