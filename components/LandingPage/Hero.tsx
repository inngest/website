import Link from "next/link";
import React from "react";

export default function Hero({
  headline,
  subheadline,
  ctas,
}: {
  headline: string;
  subheadline: string;
  ctas: {
    href: string;
    text: string | React.ReactNode;
    kind: "button" | "link";
  }[];
}) {
  return (
    <header className="relative pb-8">
      {/* bg gradient - nested containers to fix overflow issues and viewport sizing on mobile */}
      <div className="absolute top-[-84px] w-full h-full min-h-[500px] overflow-hidden">
        <div
          className="absolute z-0 h-full lg:h-[660px] w-full rotate-45 translate-y-[-50%] translate-x-[-15%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(var(--color-primary-xIntense) / 0.3) 0%,rgba(var(--color-primary-xIntense) / 0) 80%)",
          }}
        ></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto py-28 px-4 sm:px-8 text-basis text-center text-balance">
        <h1 className="text-5xl leading-tight md:text-6xl font-semibold bg-clip-text text-transparent bg-gradient-to-bl from-[rgb(var(--color-carbon-300))] to-[rgb(var(--color-carbon-50))]">
          {headline}
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-subtle bg-clip-text text-transparent bg-gradient-to-bl from-[rgb(var(--color-carbon-300))] to-[rgba(var(--color-carbon-200)/0.8)]">
          {subheadline}
        </p>
        <div className="mt-10 flex flex-row flex-wrap justify-center items-center gap-4">
          {ctas.map((cta, idx) => {
            if (cta.kind === "button") {
              return (
                <Link
                  key={idx}
                  href={cta.href}
                  className="inline-flex items-center gap-1 rounded-md font-medium px-6 py-2 bg-cta hover:bg-ctaHover transition-all text-carbon-1000 whitespace-nowrap"
                >
                  {cta.text}
                </Link>
              );
            }
            return (
              <Link
                key={idx}
                href={cta.href}
                className="inline-flex items-center gap-1 font-medium px-6 py-2 hover:underline transition-all text-basis whitespace-nowrap"
              >
                {cta.text}
              </Link>
            );
          })}
        </div>
      </div>
      <span className="block mx-auto h-0.5 w-[84px] bg-[rgba(var(--color-foreground-base)/0.3)]"></span>
    </header>
  );
}
