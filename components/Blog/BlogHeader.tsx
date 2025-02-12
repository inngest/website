import { Rss } from "react-feather";
import { BLOG_CATEGORIES } from "./index";

export default function BlogHeader({ description }: { description: string }) {
  const categoryLinks = Object.keys(BLOG_CATEGORIES).map((k) => ({
    href: `/blog/category/${k}`,
    text: BLOG_CATEGORIES[k],
  }));
  categoryLinks.push({
    href: "/changelog",
    text: "Changelog",
  });
  return (
    <div className="flex flex-col xl:flex-row gap-2 lg:gap-4 items-start xl:items-center">
      <div className="flex flex-row items-center justify-between w-full lg:w-auto">
        <h2 className="font-bold text-base text-white lg:border-r border-carbon-600/50 pr-4">
          Blog
        </h2>
      </div>
      <div className="flex flex-row gap-2 lg:gap-4 items-center">
        <p className="text-carbon-200 text-sm">{description}</p>
        <a
          href="/api/rss.xml"
          className="hidden md:block py-1 rounded-md transition-all text-subtle hover:text-white border border-transparent hover:border-carbon-200/30"
        >
          <Rss className="h-4" />
        </a>
      </div>
      <div className="flex flex-row gap-2 lg:gap-4 items-center">
        <span className="text-basis text-sm">Categories:</span>
        {categoryLinks.map((link) => (
          <a href={link.href} className="text-subtle text-sm hover:text-link">
            {link.text}
          </a>
        ))}
      </div>
    </div>
  );
}
