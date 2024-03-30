import clsx from "clsx";

export default function Heading({
  title,
  lede,
  context,
  level = 1,
  className = "",
  ledeClassName = "",
}: {
  title: React.ReactNode;
  lede?: React.ReactNode;
  context?: string;
  level?: number;
  className?: string;
  ledeClassName?: string;
}) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <div className={clsx("text-left", className)}>
      {context && <span className="text-sm text-slate-400">{context}</span>}
      <Tag
        className={clsx(
          level === 1 && "text-3xl md:text-4xl lg:text-5xl",
          level === 2 && "text-2xl md:text-3xl lg:text-4xl",
          "mt-2 leading-snug font-semibold tracking-tight",
          "bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent"
        )}
      >
        {title}
      </Tag>
      {!!lede && (
        <p
          className={clsx(
            "my-4 text-sm sm:text-base md:text-lg max-w-[720px] text-body",
            ledeClassName
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
