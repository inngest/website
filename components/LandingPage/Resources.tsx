import Link from "next/link";
import {
  RiBookmarkLine,
  RiBookOpenLine,
  RiMessageLine,
  RiArrowRightLine,
} from "@remixicon/react";

export default function Resources({
  items,
}: {
  items: {
    type: "blog" | "docs" | "contact";
    title: string;
    description: string;
    url: string;
  }[];
}) {
  return (
    <div className="max-w-6xl w-[90%] px-4 sm:w-auto mx-auto my-12 grid md:grid-cols-3 gap-8">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="p-px rounded-lg bg-gradient-to-br from-[rgba(var(--color-carbon-400)/0.4)] via-transparent to-transparent overflow-clip"
        >
          <div
            className="p-6 sm:p-8 h-full flex flex-col items-start gap-4 bg-canvasBase rounded-lg"
            style={{
              background: `linear-gradient(108deg, rgba(204, 204, 204, 0.12) 9.67%, rgba(0, 0, 0, 0.00) 49.19%), #050505`,
              backgroundBlendMode: `hard-light, normal`,
            }}
          >
            {item.type === "blog" ? (
              <RiBookmarkLine className="h-6 w-6 text-muted" />
            ) : item.type === "docs" ? (
              <RiBookOpenLine className="h-6 w-6 text-muted" />
            ) : item.type === "contact" ? (
              <RiMessageLine className="h-6 w-6 text-muted" />
            ) : (
              ""
            )}
            <h3 className="text-xl text-basis">{item.title}</h3>
            <p className="text-subtle grow">{item.description}</p>
            <Link
              href={item.url}
              className="px-4 py-2 flex flex-row gap-2 items-center text-basis rounded-md border border-subtle hover:bg-carbon-50/10"
            >
              {item.type === "blog"
                ? "Read article"
                : item.type === "docs"
                ? "View documentation"
                : item.type === "contact"
                ? "Contact sales"
                : "View resource"}
              <RiArrowRightLine className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
