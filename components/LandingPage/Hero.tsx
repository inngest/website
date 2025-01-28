import Link from "next/link";
import Image from "next/image";
import React from "react";
import { cn } from "src/components/utils/classNames";

export default function Hero({
  headline,
  subheadline,
  ctas = [],
  layout = "default",
  logosHeading = "Trusted by modern software teams worldwide:",
  logos = [],
  children,
}: {
  headline: string;
  subheadline: string;
  ctas?: {
    href: string;
    text: string | React.ReactNode;
    kind: "button" | "link";
  }[];
  layout?: "default" | "horizontal";
  logosHeading?: string;
  logos?: {
    src: string;
    name: string;
    scale?: number;
  }[];
  children?: React.ReactElement;
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
      <div
        className={cn(
          "relative z-10 flex flex-col items-center gap-8 mx-auto py-28 px-4 sm:px-8 text-basis text-balance",
          logos?.length > 0 ? "pt-28 pb-12" : "py-28",
          layout === "default" && "max-w-4xl text-center",
          layout === "horizontal" && "max-w-7xl flex flex-row"
        )}
      >
        <div>
          <h1 className="text-5xl leading-tight md:text-6xl md:leading-tight font-semibold bg-clip-text text-transparent bg-gradient-to-bl from-[rgb(var(--color-carbon-300))] to-[rgb(var(--color-carbon-50))]">
            {headline}
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-subtle bg-clip-text text-transparent bg-gradient-to-bl from-[rgb(var(--color-carbon-300))] to-[rgba(var(--color-carbon-200)/0.8)]">
            {subheadline}
          </p>
          <div
            className={cn(
              "mt-10 flex flex-row flex-wrap justify-center items-center gap-4",
              layout === "horizontal" && "justify-start"
            )}
          >
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
        {children}
      </div>
      {logos?.length > 0 && (
        <div className="relative z-10 my-12 flex flex-col gap-6 items-center sm:pb-8">
          <p className="mx-8 text-sm text-balance text-subtle">
            {logosHeading}
          </p>
          <div className="grid grid-cols-2 sm:flex flex-wrap lg:flex-nowrap gap-x-4 sm:gap-x-10 gap-y-6 sm:gap-y-8 mx-8">
            {logos.map(({ src, name, scale = 1 }, idx) => (
              <Image
                key={idx}
                src={src}
                alt={name}
                title={name}
                width={120 * 0.8 * scale}
                height={30 * 0.8 * scale}
                className={cn(
                  "m-auto width-auto transition-all grayscale opacity-80 invert dark:invert-0",
                  `max-h-[${36 * scale}px]`,
                  idx === 4 && "hidden sm:block",
                  idx > 4 && "hidden xl:block"
                )}
              />
            ))}
          </div>
        </div>
      )}
      <span className="block mx-auto h-0.5 w-[84px] bg-[rgba(var(--color-foreground-base)/0.3)]"></span>
    </header>
  );
}
