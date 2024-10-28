import Link from "next/link";
import clsx from "clsx";
import { RiArrowRightSLine } from "@remixicon/react";

export type MasonryGridItem = {
  title: string;
  description: string;
  image: string;
  url?: string;
  className?: string;
};

export default function MasonryGrid({ items }: { items: MasonryGridItem[] }) {
  return (
    // <div className="my-8 sm:my-16 mx-6 md:mx-auto max-w-6xl grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 sm:gap-y-10">
    <div className="max-w-6xl mx-auto sm:my-16 px-4 lg:px-0 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(({ title, description, url, image, className }, idx) => (
        <MasonryItem key={idx} wrapperClassName={className}>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl">
              {url ? (
                <Link
                  href={url}
                  className="flex flex-row gap-2 items-center group hover:underline underline-offset-2 transition-all cursor-pointer"
                >
                  {title}{" "}
                  <RiArrowRightSLine className="group-hover:translate-x-1.5 relative top-px transition-transform duration-150 " />
                </Link>
              ) : (
                title
              )}
            </h3>
            <p className="text-subtle text-sm">{description}</p>
          </div>
          <img src={image} alt={`Graphic of ${title}`} />
        </MasonryItem>
      ))}
    </div>
  );
}

function MasonryItem({
  wrapperClassName,
  className,
  children,
}: {
  wrapperClassName?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "max-w-md p-px rounded-lg bg-gradient-to-r from-[rgba(20,184,166,0.3)] to-[rgba(33,175,255,0.3)]",
        wrapperClassName
      )}
      style={{
        background: `linear-gradient(90deg, rgba(102, 102, 102, 0.16) 0%, rgba(156, 156, 156, 0.17) 4%, rgba(146, 146, 146, 0.18) 25.5%, rgba(203, 203, 203, 0.18) 37.5%, rgba(255, 255, 255, 0.20) 70%, rgba(190, 190, 190, 0.19) 84%, rgba(131, 131, 131, 0.18) 96%, rgba(152, 152, 152, 0.10) 100%)`,
      }}
    >
      <div
        className={clsx(
          "flex flex-col h-full gap-3 justify-between p-6 bg-canvasBase rounded-lg text-basis",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
