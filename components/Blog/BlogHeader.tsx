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
    <div className="flex flex-col items-start gap-2 lg:gap-4 xl:flex-row xl:items-center">
      <div className="flex w-full flex-row items-center justify-between lg:w-auto">
        <h2 className="border-carbon-600/50 pr-4 text-base font-bold text-white lg:border-r">
          Blog
        </h2>
      </div>
      <div className="flex flex-row items-center gap-2 lg:gap-4">
        <p className="text-sm text-carbon-200">{description}</p>
        <a
          href="/api/rss.xml"
          className="hidden rounded-md border border-transparent py-1 text-subtle transition-all hover:border-carbon-200/30 hover:text-white md:block"
        >
          <Rss className="h-4" />
        </a>
      </div>
      <div className="flex flex-row items-center gap-2 lg:gap-4">
        <span className="text-sm text-basis">Categories:</span>
        {categoryLinks.map((link) => (
          <a
            href={link.href}
            key={link.href}
            className="text-sm text-subtle hover:text-link"
          >
            {link.text}
          </a>
        ))}
      </div>
    </div>
  );
}
