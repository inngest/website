import clsx from "clsx";

export default function Card({
  variant = "default",
  className,
  wrapperClassName,
  children,
}: {
  variant?: "default" | "subtle" | "hover";
  className?: string;
  wrapperClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "rounded-lg bg-gradient-to-r p-px",
        "bg-stone-700",
        wrapperClassName
      )}
    >
      <div
        className={clsx(
          "flex h-full flex-col gap-2 rounded-lg bg-canvasBase p-4 text-basis",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
