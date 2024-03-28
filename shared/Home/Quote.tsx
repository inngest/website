import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

export default function Quote({
  text,
  attribution: { name, title, avatar, logo },
  caseStudy,
  variant = "default",
  className,
}: {
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
}) {
  return (
    <blockquote
      className={clsx(
        "mx-auto max-w-3xl px-8 md:p-16 flex flex-col gap-8 bg-[url(/assets/textures/wave.svg)] bg-cover bg-no-repeat",
        variant === "default" && "md:flex-row",
        className
      )}
    >
      <p className="text-lg leading-7">
        <span className="mr-1 text-2xl leading-3 text-slate-400/80">
          &ldquo;
        </span>
        {text}
        <span className="ml-1 text-2xl leading-3 text-slate-400/80">
          &rdquo;
        </span>
      </p>
      <footer className="min-w-[180px] flex flex-col gap-4">
        {!!avatar && (
          <Image
            src={avatar}
            alt={`Image of ${name}`}
            height="72"
            width="72"
            className="rounded-full h-12 w-12 lg:h-20 lg:w-20"
          />
        )}
        {!!logo && (
          <Image
            src={logo}
            alt={`Logo of ${name}`}
            height="72"
            width="128"
            className="w-full max-w-[220px]"
          />
        )}
        <cite className="text-slate-300 leading-8 not-italic">
          <div className="mb-2 text-lg">{name}</div>
          <div className="text-sm">{title}</div>
        </cite>
        {!!caseStudy && (
          <Link
            href={caseStudy}
            className="mt-4 mx-auto rounded-md font-medium px-6 py-2 bg-slate-800 hover:bg-slate-600 transition-all text-white border border-slate-800 hover:border-slate-600 hover:bg-slate-500/10 whitespace-nowrap"
          >
            Read the case study →
          </Link>
        )}
      </footer>
    </blockquote>
  );
}
