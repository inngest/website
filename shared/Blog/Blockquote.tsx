import { Button } from "src/shared/Button";

type BlockquoteProps = {
  text: React.ReactNode | string;
  attribution: {
    name: string;
    title: string;
    company?: string;
  };
  avatar?: string;
  logo?: string;
  /** Link to the original post (X, LinkedIn, Reddit). */
  sourceUrl?: string;
  sourceLabel?: string;
};

export default function Blockquote({
  text,
  attribution,
  avatar,
  logo,
  sourceUrl,
  sourceLabel = "View original",
}: BlockquoteProps) {
  return (
    <figure className="not-prose rounded-lg border border-indigo-300/20 py-6 pl-8 pr-10">
      <blockquote className="text-lg">&ldquo;{text}&rdquo;</blockquote>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        {!!avatar && (
          <img
            className="h-10 w-10 rounded-full"
            src={avatar}
            alt={`Image of ${attribution.name}`}
          />
        )}
        <figcaption>
          <span className="font-semibold text-white">{attribution.name}</span> -{" "}
          {attribution.title}
          {attribution.company && `, ${attribution.company}`}
          {sourceUrl ? (
            <>
              {" "}
              ·{" "}
              <a
                href={sourceUrl}
                className="text-indigo-300 hover:text-indigo-200"
                rel="noopener noreferrer"
                target="_blank"
              >
                {sourceLabel}
              </a>
            </>
          ) : null}
        </figcaption>
        {!!logo && (
          <div className="flex grow sm:justify-end">
            <img
              className="h-10 max-w-36 self-end"
              src={logo}
              alt={
                attribution.company
                  ? `Logo of ${attribution.company}`
                  : "Company logo"
              }
            />
          </div>
        )}
      </div>
    </figure>
  );
}
