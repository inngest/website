import { Button } from "src/shared/Button";

type CTACalloutProps = {
  text: React.ReactNode | string;
  cta?: {
    href: string;
    text: string;
  };
  wide?: boolean;
};

export default function CTACallout({
  text,
  cta,
  wide = false,
}: CTACalloutProps) {
  return (
    <aside
      className={`not-prose ${
        wide ? "max-w-[80ch]" : "max-w-[70ch]"
      } m-auto my-12 rounded-lg bg-gradient-to-br from-[rgba(var(--color-carbon-400)/0.4)] via-transparent to-transparent p-px text-basis`}
    >
      <div
        className="flex flex-col items-start gap-5 rounded-lg px-6 py-5 leading-relaxed"
        style={{
          background: `linear-gradient(108deg, rgba(204, 204, 204, 0.12) 9.67%, rgba(0, 0, 0, 0.00) 49.19%), #050505`,
        }}
      >
        <p className="text-sm lg:text-base">{text}</p>
        {!!cta && (
          <Button href={cta.href} arrow="right">
            {cta.text}
          </Button>
        )}
      </div>
    </aside>
  );
}
