import Link from "next/link";
import {
  RiBookmarkLine,
  RiBookOpenLine,
  RiMessageLine,
  RiGithubLine,
  RiArrowRightLine,
} from "@remixicon/react";

export default function Resources({
  items,
}: {
  items: {
    type: "blog" | "docs" | "contact" | "example";
    title: string;
    description: string;
    url: string;
  }[];
}) {
  return (
    <div className="mx-auto my-12 grid w-[90%] max-w-6xl gap-8 px-4 sm:w-auto sm:grid-cols-2 md:grid-cols-3">
      {items.map((item, idx) => (
        <div key={idx} className="overflow-clip  bg-stone-800 p-px">
          <div className="flex h-full flex-col items-start gap-4 bg-stone-800 p-6 sm:p-8">
            {item.type === "blog" ? (
              <RiBookmarkLine className="h-6 w-6 text-muted" />
            ) : item.type === "docs" ? (
              <RiBookOpenLine className="h-6 w-6 text-muted" />
            ) : item.type === "contact" ? (
              <RiMessageLine className="h-6 w-6 text-muted" />
            ) : item.type === "example" ? (
              <RiGithubLine className="h-6 w-6 text-muted" />
            ) : (
              ""
            )}
            <h3 className="text-xl text-basis">{item.title}</h3>
            <p className="grow text-subtle">{item.description}</p>
            <Link
              href={item.url}
              className="flex flex-row items-center gap-2 rounded-md border border-subtle px-4 py-2 text-basis hover:bg-carbon-50/10"
            >
              {item.type === "blog"
                ? "Read article"
                : item.type === "docs"
                ? "View documentation"
                : item.type === "contact"
                ? "Contact sales"
                : item.type === "example"
                ? "Try the example"
                : "View resource"}
              <RiArrowRightLine className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
