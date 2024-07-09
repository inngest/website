import React from "react";
import Link from "next/link";
import clsx from "clsx";

export function Example({
  example,
  wide,
}: {
  example: {
    href: string;
    title: string;
    description?: string;
    technology?: "";
    author?: string;
    authorSocial?: string;
    demo?: string;
    github: string;
    image?: string;
  };
  wide?: boolean;
}) {
  return (
    <div
      className={clsx(
        `group relative flex rounded-lg bg-slate-50 transition-shadow hover:shadow-md hover:shadow-slate-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5 ring-1 ring-inset ring-slate-900/7.5 group-hover:ring-slate-900/10 dark:ring-white/10 dark:group-hover:ring-white/2`,
        wide ? `flex-row items-start p-3` : `flex-col p-4`
      )}
    >
      {!!example.image && (
        <div
          className={clsx(
            "flex justify-center",
            wide && "relative rounded-lg m-0"
          )}
        >
          <img
            src={example.image}
            alt={example.title}
            className="rounded-lg h-auto w-full object-contain filter saturate-50 transition duration-300 ease-in-out group-hover:saturate-100"
            style={{ marginBottom: 0, marginTop: 0 }}
          />
        </div>
      )}
      <div
        className="relative flex flex-col justify-center"
        style={{ marginLeft: wide ? "16px" : "0" }}
      >
        <h3 className="text-m font-semibold leading-6">{example.title}</h3>
        {example.description && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {example.description}
          </p>
        )}
        {example.technology && (
          <ExampleInfo label="Technology used">
            {example.technology}
          </ExampleInfo>
        )}
        <ExampleInfo label="Explore">
          <Link
            href={example.github}
            className="hover:text-slate-600 dark:hover:text-slate-400 hover:underline"
          >
            Code
          </Link>
          {example.demo && (
            <>
              {" | "}{" "}
              <Link
                href={example.demo}
                className="hover:text-slate-600 dark:hover:text-slate-400 hover:underline"
              >
                Demo
              </Link>
            </>
          )}
        </ExampleInfo>
        <ExampleInfo label="Made by">
          {example.authorSocial ? (
            <Link
              href={example.authorSocial}
              className="hover:text-slate-600 dark:hover:text-slate-400 hover:underline"
            >
              {" "}
              {example.author}{" "}
            </Link>
          ) : (
            example.author ?? "Inngest Team"
          )}
        </ExampleInfo>
      </div>
    </div>
  );
}

const ExampleInfo: React.FC<React.PropsWithChildren<{ label: string }>> = ({
  label,
  children,
}) => {
  return (
    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
      <span className="text-sm font-semibold">{label}: </span>
      {children}
    </div>
  );
};
