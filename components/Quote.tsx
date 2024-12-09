import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Button } from "src/shared/Button";

type Props = {
  text: string;
  attribution: {
    name: string;
    title: React.ReactNode | string;
    avatar?: string;
    logo?: string;
  };
  caseStudy?: string;
  variant?: "default" | "box";
  className?: string;
};

export default function Quote({
  text,
  attribution: { name, title, avatar, logo },
  caseStudy,
  variant = "default",
  className,
}: Props) {
  return (
    <blockquote
      className={clsx(
        "mx-4 sm:mx-auto rounded-lg",
        variant === "default" && "max-w-[860px]",
        variant === "box" &&
          "max-w-[830px] p-px bg-gradient-to-br from-[rgba(var(--color-carbon-400)/0.4)] to-transparent",
        className
      )}
    >
      <div
        className={clsx(
          "flex flex-col items-start gap-4 text-basis rounded-lg",
          variant === "default" && "px-8 md:p-12 ",
          variant === "box" && "p-8"
        )}
        style={{
          background:
            variant === "box"
              ? `linear-gradient(108deg, rgba(204, 204, 204, 0.12) 9.67%, rgba(0, 0, 0, 0.00) 49.19%), #141414`
              : "transparent",
        }}
      >
        <p className="relative text-lg leading-7">
          <span className="absolute -translate-x-2">&ldquo;</span>
          {text}
          <span className="">&rdquo;</span>
        </p>
        <div
          className={clsx(
            "flex gap-4 w-full",
            variant === "box"
              ? "flex-row items-end justify-between"
              : "flex-col"
          )}
        >
          <footer className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-row items-center gap-4">
              {!!avatar && (
                <Image
                  src={avatar}
                  alt={`Image of ${name}`}
                  height="72"
                  width="72"
                  className="rounded-full h-12 w-12 lg:h-16 lg:w-16"
                />
              )}
              <cite className="flex flex-col justify-center leading-8 not-italic text-sm">
                <div className="font-semibold text-lg">{name}</div>
                <div>{title}</div>
              </cite>
            </div>
            {!!logo && (
              <Image
                src={logo}
                alt={`Logo of ${name}`}
                height="72"
                width="128"
                className="min-w-[140px] sm:w-full max-w-[220px] max-h-12"
              />
            )}
          </footer>
          {!!caseStudy && (
            <div className="flex w-full justify-end">
              <Button variant="primary" href={caseStudy}>
                Read case study
              </Button>
            </div>
          )}
        </div>
      </div>
    </blockquote>
  );
}
