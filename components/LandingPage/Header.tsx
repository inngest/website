import clsx from "clsx";
import { H2 } from "./Heading";

export default function Heading({
  title,
  description,
  className,
  layout = "vertical",
}: {
  title?: string | React.ReactNode;
  description?: string | string[];
  className?: string;
  layout?: "vertical" | "horizontal";
}) {
  return (
    <div
      className={clsx(
        "mx-auto mb-8 px-4 flex gap-4 items-center text-basis",
        "text-balance",
        layout === "vertical" &&
          "sm:px-6 lg:px-8 max-w-4xl flex-col text-center",
        layout === "horizontal" && "max-w-6xl flex-col md:flex-row text-left",
        className
      )}
    >
      {!!title && <H2>{title}</H2>}
      {!!description && Array.isArray(description) ? (
        <div className="flex flex-col gap-4">
          {description.map((para, idx) => (
            <p key={idx} className="text-base md:text-lg max-w-4xl text-subtle">
              {para}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-base md:text-lg max-w-4xl text-subtle">
          {description}
        </p>
      )}
    </div>
  );
}
