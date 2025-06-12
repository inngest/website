export default function GridBackground({
  gridSize = { default: "75px", md: "50px", sm: "30px" },
  lineColor = "rgba(70, 70, 70, 0.3)",
  className = "",
}: {
  gridSize?: string | { default: string; md?: string; sm?: string };
  lineColor?: string;
  className?: string;
}) {
  // Determine the grid size based on the type
  const getGridSizeValue = () => {
    if (typeof gridSize === "string") {
      return gridSize;
    }
    return gridSize.default;
  };

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[-1] bg-stone-950 ${className}`}
      style={{
        width: "100vw",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        height: "100%", // Match parent height
      }}
    >
      {/* Default grid - visible on large screens */}
      <div
        className="hidden h-full w-full bg-stone-950 lg:block"
        style={{
          backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
          backgroundSize: `${getGridSizeValue()} ${getGridSizeValue()}`,
        }}
      ></div>

      {/* Medium grid - visible on md screens */}
      {typeof gridSize !== "string" && gridSize.md && (
        <div
          className="hidden h-full w-full bg-stone-950 md:block lg:hidden"
          style={{
            backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
            backgroundSize: `${gridSize.md} ${gridSize.md}`,
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></div>
      )}

      {/* Small grid - visible only on sm screens and smaller */}
      {typeof gridSize !== "string" && gridSize.sm && (
        <div
          className="block h-full w-full bg-stone-950 sm:block md:hidden"
          style={{
            backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
            backgroundSize: `${gridSize.sm} ${gridSize.sm}`,
            position: "absolute",
            top: 0,
            left: 0,
          }}
        ></div>
      )}
    </div>
  );
}
