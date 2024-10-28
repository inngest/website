import clsx from "clsx";

export default function Heading({
  title,
  description,
  className,
  layout = "vertical",
}: {
  title?: string;
  description?: string | string[];
  className?: string;
  layout?: "vertical" | "horizontal";
}) {
  return (
    <div
      className={clsx(
        "mx-auto px-4 flex gap-4 items-center text-basis",
        "text-balance",
        layout === "vertical" &&
          "sm:px-6 lg:px-8 max-w-4xl flex-col text-center",
        layout === "horizontal" && "max-w-6xl flex-col md:flex-row text-left",
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
