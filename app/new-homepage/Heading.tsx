import clsx from "clsx";
export default function Heading({
  label,
  title,
  className,
}: {
  label?: string;
  title?: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "mx-auto max-w-7xl px-2 md:px-6 lg:px-8 flex flex-col gap-8 items-center",
        className
      )}
    >
      {!!label && (
        <p className="text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 uppercase font-bold">
          {label}
        </p>
      )}
      {!!title && <h2 className="text-body">{title}</h2>}
    </div>
  );
}
