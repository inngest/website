import { type ReactNode } from "react";

export interface FormTestimonialLogo {
  src: string;
  alt: string;
  /** Rendered size in px; width/height reserve the box before load. */
  width: number;
  height: number;
}

const RESEND_LOGO: FormTestimonialLogo = {
  // resend.svg is a 377×80 white lockup; 24px tall renders it ~113px wide.
  src: "/assets/v1/logos/resend.svg",
  alt: "Resend",
  width: 113,
  height: 24,
};

const RESEND_QUOTE = (
  <>
    The DX and visibility with Inngest is really incredible. We are able to
    develop functions locally easier and faster that with our previous queue.
    Also, Inngest&apos;s tools give us the visibility to debug issues much
    quicker than before.
  </>
);

/**
 * Customer quote shown in the left column of the contact
 * (`ContactForm`) and sales (`SalesInquiryForm`) form pages. Both render
 * the same quote, so it lives here rather than being duplicated per page.
 *
 * `caption`, `logo`, and `quote` default to the Resend testimonial; callers
 * can override any of them (the YC page swaps the caption, /startups uses
 * Ordinal) without duplicating the figure markup.
 */
export default function FormTestimonial({
  caption = (
    <>
      <span className="block">Bu Kinoshita</span>
      <span className="block">Co-Founder</span>
    </>
  ),
  logo = RESEND_LOGO,
  quote = RESEND_QUOTE,
}: {
  caption?: ReactNode;
  /** Defaults to the Resend logo; pass another customer's lockup to
   *  swap the quote (e.g. /startups uses Ordinal). */
  logo?: FormTestimonialLogo;
  quote?: ReactNode;
}) {
  return (
    <figure className="flex flex-col items-start gap-8">
      <img
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        decoding="async"
        className="w-auto"
        style={{ height: logo.height }}
      />
      <blockquote className="flex flex-col gap-[33px]">
        <p className="text-v1-heading-sm text-v1-frost">{quote}</p>
        <figcaption className="font-v1Body text-[16px] leading-[24px] text-v1-frost">
          {caption}
        </figcaption>
      </blockquote>
    </figure>
  );
}
