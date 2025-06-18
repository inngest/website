import Image from "next/image";
import Link from "next/link";
import { cn } from "./utils/classNames";
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
  variant?: "default" | "box" | "no-padding";
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
      className={cn(
        "mx-4 sm:mx-auto",
        variant === "default" && "max-w-[860px]",
        variant === "box" && "max-w-[830px] bg-stone-800 p-px",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col items-start gap-4 rounded-lg text-basis",
          variant === "default" && "px-8 md:p-12 ",
          variant === "box" && "p-8"
        )}
        style={{
          background: variant === "box" ? `` : "transparent",
        }}
      >
        <p className="relative text-lg leading-7">
          <span className="absolute -translate-x-2">&ldquo;</span>
          {text}
          <span className="">&rdquo;</span>
        </p>
        <div
          className={cn(
            "flex w-full gap-4",
            variant === "box"
              ? "flex-row items-end justify-between"
              : "flex-col"
          )}
        >
          <footer className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-row items-center gap-4">
              {!!avatar && (
                <Image
                  src={avatar}
                  alt={`Image of ${name}`}
                  height="72"
                  width="72"
                  className="h-12 w-12 rounded-full lg:h-16 lg:w-16"
                />
              )}
              <cite className="flex flex-col justify-center text-sm not-italic leading-8">
                <div className="text-lg font-semibold">{name}</div>
                <div>{title}</div>
              </cite>
            </div>
            {!!logo && (
              <Image
                src={logo}
                alt={`Logo of ${name}`}
                height="72"
                width="128"
                className="max-h-12 min-w-[140px] max-w-[220px] sm:w-full"
              />
            )}
          </footer>
          {!!caseStudy && (
            <div className="flex w-full justify-end">
              <Button variant="primary" href={caseStudy}>
                Read customer story
              </Button>
            </div>
          )}
        </div>
      </div>
    </blockquote>
  );
}
