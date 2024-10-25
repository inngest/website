import clsx from "clsx";

export default function Heading({
  title,
  description,
  className,
}: {
  title?: string;
  description?: string | string[];
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4 items-center text-basis ",
        "text-center text-balance",
        className
      )}
    >
      {!!title && (
        <h2 className="text-3xl sm:text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-[rgb(var(--color-carbon-400))] to-[rgb(var(--color-carbon-50))]">
          {title}
        </h2>
      )}
      {!!description && Array.isArray(description) ? (
        <div>
          {description.map((para, idx) => (
            <p className="text-base md:text-lg my-4 max-w-4xl text-subtle">
              {para}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-base md:text-lg my-4 max-w-4xl text-subtle">
          {description}
        </p>
      )}
    </div>
  );
}
