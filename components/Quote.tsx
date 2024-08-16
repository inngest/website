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
  variant?: "default" | "vertical";
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
        "mx-auto max-w-[860px] px-8 md:p-12 flex flex-col items-start gap-4 text-basis",
        className
      )}
    >
      <p className="text-lg leading-7">{text}</p>
      {!!caseStudy && (
        <Button variant="primary" href={caseStudy}>
          Read case study
        </Button>
      )}
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
          <cite className="leading-8 not-italic text-sm">
            <div className="font-semibold">{name}</div>
            <div>{title}</div>
          </cite>
        </div>
        {!!logo && (
          <Image
            src={logo}
            alt={`Logo of ${name}`}
            height="72"
            width="128"
            className="w-full max-w-[220px] max-h-12"
          />
        )}
      </footer>
    </blockquote>
  );
}
