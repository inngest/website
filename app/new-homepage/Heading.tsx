import clsx from "clsx";
export default function Heading({
  label,
  title,
  description,
  className,
}: {
  label?: string;
  title?: string;
  description?: string | React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "mx-auto max-w-4xl px-2 md:px-6 lg:px-8 flex flex-col gap-4 items-center text-basis ",
        "text-center text-balance",
        className
      )}
    >
      {!!label && (
        <p className="text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 uppercase font-bold">
          {label}
        </p>
      )}
      {!!title && <h2 className="text-4xl font-bold">{title}</h2>}
      {!!description && <p className="text-lg my-4 max-w-4xl">{description}</p>}
    </div>
  );
}
