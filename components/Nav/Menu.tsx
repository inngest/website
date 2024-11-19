import Link from "next/link";
import { type RemixiconComponentType } from "@remixicon/react";

export type MenuProps = {
  title: string;
  primaryLinks?: {
    title: string;
    description: string;
    url: string;
    icon: React.ComponentType<{ size: number }> | RemixiconComponentType;
    iconBg: string;
  }[];
  secondaryTitle?: string;
  secondaryLinks?: {
    title: string;
    url: string;
    icon:
      | React.ComponentType<{
          size: number;
          color?: string;
          className?: string;
        }>
      | RemixiconComponentType;
    iconClassName?: string;
  }[];
  headerUrl?: string;
};

export default function Menu({
  title,
  primaryLinks,
  secondaryTitle,
  secondaryLinks,
  headerUrl,
}: MenuProps) {
  return (
    <div className="px-4 md:py-2 md:px-2 w-full md:w-auto md:overflow-auto bg-surfaceBase md:border border-subtle md:rounded-lg md:absolute top-[70px] -left-4 md:hidden group-hover:md:block md:shadow-2xl">
      <div className="flex flex-col md:w-[520px]">
        <h3 className="text-base text-basis md:hidden font-semibold mb-2 px-2 pt-3">
          {headerUrl ? <a href={headerUrl}>{title}</a> : title}
        </h3>
        {!!primaryLinks.length && (
          <div className="flex w-full flex-col gap-1.5">
            {primaryLinks.map(({ title, url, description, ...link }) => (
              <Link
                key={title}
                href={url}
                className="group hover:bg-surfaceSubtle px-2 py-2 rounded-md transition-all duration-150 flex items-start lg:items-center leading-none group/nav-item"
              >
                <div
                  className={`h-11 w-11 flex flex-shrink-0 items-center justify-center rounded ${link.iconBg}`}
                >
                  <link.icon size={32} />
                </div>
                <div className="pl-3.5">
                  <h4 className={`text-base text-white flex items-center`}>
                    {title}
                  </h4>
                  <span className="text-muted group-hover:text-basis text-sm">
                    {description}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="flex flex-col w-full">
          {!!secondaryTitle && (
            <h3 className="text-sm text-basis/80 font-semibold mb-2 mt-3 px-2">
              {secondaryTitle}
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {secondaryLinks?.map(
              ({ title, url, iconClassName, ...link }, idx) => {
                return (
                  <Link
                    key={idx}
                    href={url}
                    className={`text-basis rounded-sm flex gap-2 items-center py-2.5 pl-2 pr-2 lg:bg-surfaceSubtle/40 hover:bg-surfaceSubtle hover:text-white transition-all duration-150 group/nav-item`}
                  >
                    <link.icon size={28} className={iconClassName} />
                    {title}
                  </Link>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
