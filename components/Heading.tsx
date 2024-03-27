import clsx from "clsx";

export default function Heading({
  title,
  lede,
  context,
  className = "",
  ledeClassName = "",
}: {
  title: React.ReactNode;
  lede?: React.ReactNode;
  context?: string;
  className?: string;
  ledeClassName?: string;
}) {
  return (
    <div className={clsx("text-left", className)}>
      {context && <span className="text-sm text-slate-100">{context}</span>}
      <h2
        className={clsx(
          "text-2xl md:text-4xl lg:text-5xl leading-snug font-semibold tracking-tight",
          "bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent"
        )}
      >
        {title}
      </h2>
      {!!lede && (
        <p
          className={clsx(
            "my-4 text-sm sm:text-base md:text-lg",
            "text-body",
            ledeClassName
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
