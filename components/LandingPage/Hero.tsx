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
      <div className="absolute top-[-84px] h-full min-h-[500px] w-full overflow-hidden">
        {/* <div
          className="absolute z-0 h-full w-full translate-x-[-15%] translate-y-[-50%] rotate-45 lg:h-[660px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(var(--color-primary-xIntense) / 0.3) 0%,rgba(var(--color-primary-xIntense) / 0) 80%)",
          }}
        ></div> */}
      </div>
      <div
        className={cn(
          "relative z-10 mx-auto flex flex-col items-center gap-8 text-balance px-4 py-28 text-basis sm:px-8",
          logos?.length > 0 ? "pb-12 pt-28" : "py-28",
          layout === "default" && "max-w-4xl text-center",
          layout === "horizontal" && "flex max-w-7xl flex-row"
        )}
      >
        <div>
          <h1 className="font-whyteInktrap text-5xl font-semibold leading-tight text-stone-50 md:text-6xl md:leading-tight">
            {headline}
          </h1>
          <p className="mt-6 bg-gradient-to-bl from-[rgb(var(--color-carbon-300))] to-[rgba(var(--color-carbon-200)/0.8)] bg-clip-text text-xl text-subtle text-transparent md:text-2xl">
            {subheadline}
          </p>
          <div
            className={cn(
              "mt-10 flex flex-row flex-wrap items-center justify-center gap-4",
              layout === "horizontal" && "justify-start"
            )}
          >
            {ctas.map((cta, idx) => {
              if (cta.kind === "button") {
                return (
                  <Link
                    key={idx}
                    href={cta.href}
                    className="inline-flex items-center gap-1  whitespace-nowrap bg-cta px-6 py-2 font-medium text-carbon-1000 transition-all hover:bg-ctaHover"
                  >
                    {cta.text}
                  </Link>
                );
              }
              return (
                <Link
                  key={idx}
                  href={cta.href}
                  className="inline-flex items-center gap-1 whitespace-nowrap px-6 py-2 font-medium text-basis transition-all hover:underline"
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
        <div className="relative z-10 my-12 flex flex-col items-center gap-6 sm:pb-8">
          <p className="mx-8 text-balance text-sm text-subtle">
            {logosHeading}
          </p>
          <div className="mx-8 grid grid-cols-2 flex-wrap gap-x-4 gap-y-6 sm:flex sm:gap-x-10 sm:gap-y-8 lg:flex-nowrap">
            {logos.map(({ src, name, scale = 1 }, idx) => (
              <Image
                key={idx}
                src={src}
                alt={name}
                title={name}
                width={120 * 0.8 * scale}
                height={30 * 0.8 * scale}
                className={cn(
                  "width-auto m-auto opacity-80 grayscale invert transition-all dark:invert-0",
                  `max-h-[${36 * scale}px]`,
                  idx === 4 && "hidden sm:block",
                  idx > 4 && "hidden xl:block"
                )}
              />
            ))}
          </div>
        </div>
      )}
      <span className="mx-auto block h-0.5 w-[84px] bg-[rgba(var(--color-foreground-base)/0.3)]"></span>
    </header>
  );
}
