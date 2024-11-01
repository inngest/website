import { Rss } from "react-feather";
import Dropdown from "../Dropdown";
import { BLOG_CATEGORIES } from "./index";

export default function BlogHeader({ description }: { description: string }) {
  const categoryLinks = Object.keys(BLOG_CATEGORIES).map((k) => ({
    href: `/blog/category/${k}`,
    text: BLOG_CATEGORIES[k],
  }));
  return (
    <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 items-start lg:items-center">
      <div className="flex flex-row items-center justify-between w-full lg:w-auto">
        <h2 className="font-bold text-base text-white lg:border-r border-carbon-600/50 pr-4">
          Blog
        </h2>
        <Dropdown
          title="Categories"
          items={categoryLinks}
          className="block lg:hidden"
        />
      </div>
      <div className="flex flex-row gap-2 lg:gap-4 items-center">
        <p className="text-carbon-200 text-sm">{description}</p>
        <a
          href="/api/rss.xml"
          className="hidden md:block py-1 rounded-md transition-all text-carbon-300 hover:text-white border border-transparent hover:border-carbon-200/30"
        >
          <Rss className="h-4" />
        </a>
      </div>
      <Dropdown
        title="Categories"
        items={categoryLinks}
        className="hidden lg:block"
      />
    </div>
  );
}
