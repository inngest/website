import clsx from "clsx";

export default function Comparison({
  items,
}: {
  items: {
    style: "before" | "after";
    title: string;
    image: string;
  }[];
}) {
  return (
    <div className="max-w-6xl w-[90%] px-4 sm:w-auto mx-auto my-8 grid md:grid-cols-2 gap-6">
      {items.map((item, idx) => (
        <div
          className={"p-px rounded-lg"}
          style={{
            background:
              item.style === "before"
                ? `radial-gradient(18% 28% at 24% 50%, #FDBCB87D 7%, #073AFF00 100%),radial-gradient(70% 53% at 36% 76%, #FDBCB861 0%, #073AFF00 100%),radial-gradient(21% 37% at 72% 23%, #FDBCB859 24%, #073AFF00 100%),radial-gradient(35% 56% at 79% 69%, #FDBCB854 9%, #073AFF00 100%),radial-gradient(74% 86% at 20% 22%, #FDBCB84F 24%, #073AFF00 100%),linear-gradient(125deg, #FDBCB838 1%, #FDBCB836 100%)`
                : `radial-gradient(18% 28% at 9% 9%, #2C9B6385 7%, #073AFF00 100%),radial-gradient(70% 53% at 16% 84%, #2C9B6361 0%, #073AFF00 100%),radial-gradient(21% 37% at 71% 12%, #2C9B6359 24%, #073AFF00 100%),radial-gradient(35% 56% at 91% 74%, #2C9B6354 9%, #073AFF00 100%),radial-gradient(74% 86% at 67% 38%, #2C9B634F 24%, #073AFF00 100%),linear-gradient(125deg, #2C9B6338 2%, #2C9B6336 100%)`,
          }}
        >
          <div
            key={idx}
            className="p-6 h-full flex flex-col bg-canvasBase rounded-lg"
          >
            <h3
              className={clsx(
                "mb-6 text-xl",
                item.style === "before" && "text-error",
                item.style === "after" && "text-success"
              )}
            >
              {item.title}
            </h3>
            <img
              src={item.image}
              alt={`Graphic of ${item.title}`}
              className="grow"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
