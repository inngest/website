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
  const gradient =
    variant === "default"
      ? "from-[#14B8A6] to-[#21AFFF]"
      : "from-[rgba(20,184,166,0.3)] to-[rgba(33,175,255,0.3)]";
  return (
    <div
      className={clsx(
        "p-px rounded-lg bg-gradient-to-r",
        variant === "default" && "from-[#14B8A6] to-[#21AFFF]",
        variant === "subtle" &&
          "from-[rgba(20,184,166,0.3)] to-[rgba(33,175,255,0.3)]",
        variant === "hover" &&
          "from-[rgba(20,184,166,0.3)] to-[rgba(33,175,255,0.3)] transition-all group-hover:from-[#14B8A6] group-hover:to-[#21AFFF]",
        wrapperClassName
      )}
    >
      <div
        className={clsx(
          "flex flex-col h-full gap-2 p-4 bg-canvasBase rounded-lg text-basis",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
