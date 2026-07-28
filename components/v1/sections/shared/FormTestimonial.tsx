import { type ReactNode } from "react";

/**
 * Single Resend customer quote shown in the left column of the contact
 * (`ContactForm`) and sales (`SalesInquiryForm`) form pages. Both render
 * the same quote, so it lives here rather than being duplicated per page.
 *
 * `caption` defaults to the standard two-line attribution, but callers
 * (e.g. the YC deal page, which shows a fuller "CTO & Co-founder (YC W23)"
 * title) can override it without duplicating the quote/logo markup.
 */
export default function FormTestimonial({
  caption = (
    <>
      <span className="block">Bu Kinoshita</span>
      <span className="block">Co-Founder</span>
    </>
  ),
}: {
  caption?: ReactNode;
}) {
  return (
    <figure className="flex flex-col items-start gap-8">
      {/* resend.svg is a 65×16 white lockup; h-6 renders it ~98px wide.
          width/height reserve the box to avoid layout shift before the
          SVG loads. */}
      <img
        src="/assets/v1/logos/resend.svg"
        alt="Resend"
        width={98}
        height={24}
        decoding="async"
        className="h-[24px] w-auto"
      />
      <blockquote className="flex flex-col gap-[33px]">
        <p className="text-v1-heading-sm text-v1-frost">
          The DX and visibility with Inngest is really incredible. We are able
          to develop functions locally easier and faster that with our previous
          queue. Also, Inngest&apos;s tools give us the visibility to debug
          issues much quicker than before.
        </p>
        <figcaption className="font-v1Body text-[16px] leading-[24px] text-v1-frost">
          {caption}
        </figcaption>
      </blockquote>
    </figure>
  );
}
