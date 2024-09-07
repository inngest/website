import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { Rss } from "react-feather";

import { RiCalendarLine } from "@remixicon/react";
import ArrowRight from "src/shared/Icons/ArrowRight";
import Footer from "../shared/Footer";
import Header from "../shared/Header";
import Container from "../shared/layout/Container";
import Tags from "../shared/Blog/Tags";
import {
  loadMarkdownFilesMetadata,
  type MDXFileMetadata,
} from "../utils/markdown";
// import { LaunchWeekBanner } from "./index";

export default function BlogLayout(props) {
  const router = useRouter();
  const { showHidden } = router.query;

  const content: BlogPost[] = props.content.map(JSON.parse);
  const visiblePosts = showHidden
    ? content
    : content
        .filter((post) => !post.hide)
        .sort((a, z) => z.date.localeCompare(a.date));

  const focus = visiblePosts.find((c) => c.focus) ?? visiblePosts[0];
  const rest = visiblePosts
    .filter((c) => !focus || c.slug !== focus.slug)
    .sort((a, z) => z.date.localeCompare(a.date));

  const description = `Updates from the Inngest team about our product, engineering, and community.`;

  return (
    <>
      <Head>
        <title>Inngest → Product & Engineering blog</title>
        <meta name="description" content={description}></meta>
        <meta
          property="og:title"
          content="Inngest → Product & Engineering blog"
        />
        <meta property="og:description" content={description} />
      </Head>

      <div className="font-sans">
        <Header />

        {/* <LaunchWeekBanner urlRef="blog-feed-banner" /> */}

        <Container className="pt-8">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 items-start lg:items-center">
            <h2 className="font-bold text-base text-white lg:border-r border-carbon-600/50 pr-4">
              Blog
            </h2>
            <p className="text-carbon-200 text-sm">{description}</p>
            <a
              href="/api/rss.xml"
              className="py-1 rounded-md transition-all text-carbon-300 hover:text-white border border-transparent hover:border-carbon-200/30"
            >
              <Rss className="h-4" />
            </a>
          </div>
          <div className="pt-16">
            {focus && (
              <a
                className="relative flex flex-col-reverse lg:flex-row xl:max-w-[1160px] bg-matcha-600 rounded-lg mb-32 group shadow-lg"
                href={focus.redirect ?? `/blog/${focus.slug}`}
              >
                <div className="absolute top-0 bottom-0 -left-[40px] -right-[40px] rounded-lg bg-matcha-500 opacity-20 rotate-1 -z-0 mx-5"></div>
                <div className="lg:w-2/5 p-8 flex flex-col items-start justify-between relative z-10">
                  <div>
                    <span className="inline-flex text-matcha-0 mb-3 text-xs font-semibold bg-matcha-700/50 px-3 py-1.5 rounded">
                      Latest Post
                    </span>
                    <h2 className="text-xl md:text-2xl lg:text-xl xl:text-2xl text-alwaysWhite mb-1 font-medium">
                      {focus.heading}
                    </h2>
                    <p className="text-basis text-sm font-medium mb-4 flex gap-1 items-center">
                      <RiCalendarLine className="h-3 w-3" />
                      {focus.humanDate} <Tags tags={focus.tags || []} />
                    </p>
                    <p className="text-slate-100">{focus.subtitle}</p>
                  </div>
                  <span className="px-4 text-sm font-medium inline-flex mt-4 bg-matcha-800 text-matcha-0 py-1.5 rounded-full group-hover:bg-matcha-700">
                    Read article
                    <ArrowRight className="group-hover:translate-x-1.5 relative top-px transition-transform duration-150 " />
                  </span>
                </div>
                {focus.image && (
                  <div className="lg:w-3/5 flex rounded-t-lg lg:rounded-t-none lg:rounded-r-lg relative group-hover:scale-105 group-hover:origin-center group-hover:rounded-lg overflow-hidden transition-all lg:pr-2">
                    <Image
                      className="z-10 w-full m-auto rounded-t-lg lg:rounded-lg group-hover:rounded-lg"
                      src={focus.image}
                      alt={`Featured image for ${focus.heading} blog post`}
                      width={900}
                      height={900 / 2}
                      quality={95}
                    />
                  </div>
                )}
              </a>
            )}

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-4 xl:gap-x-8 lg:grid-cols-3  gap-y-20">
              {rest.map((item) => (
                <li key={item.slug}>
                  <a
                    href={item.redirect ?? `/blog/${item.slug}`}
                    className="group flex flex-col rounded-lg ease-out transition-all "
                  >
                    {item.image && (
                      <div className="flex rounded-lg shadow group-hover:scale-105 transition-all">
                        {/* We use 720 as the responsive view goes full width at 720px viewport width */}
                        <Image
                          className="rounded-lg"
                          src={item.image}
                          alt={`Featured image for ${item.heading} blog post`}
                          width={720}
                          height={720 / 2}
                        />
                      </div>
                    )}
                    <div className="pt-4 xl:pt-6 xl:py-4">
                      <h2 className="text-base text-basis xl:text-lg text-white mb-1 group-hover:text-link transition-all">
                        {item.heading}
                      </h2>
                      <p className="text-muted text-sm font-medium mb-4 mt-2 flex items-center gap-1">
                        <RiCalendarLine className="h-3 w-3" />
                        {item.humanDate} <Tags tags={item.tags || []} />
                      </p>
                      <p className="text-subtle text-sm">{item.subtitle}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
        <Footer />
      </div>
    </>
  );
}

export type BlogPost = {
  heading: string;
  subtitle: string;
  author?: string;
  image: string;
  date: string;
  humanDate: string;
  tags?: string[];
  hide?: boolean;
} & MDXFileMetadata;

// This function also gets called at build time to generate specific content.
export async function getStaticProps() {
  const posts = await loadMarkdownFilesMetadata<BlogPost>("blog/_posts");
  const content = posts.map((p) => JSON.stringify(p));

  return {
    props: {
      content,
      designVersion: "2",
      meta: {
        // TODO
        title: "Product & Engineering Blog",
        description: `Updates from the Inngest team about our product, engineering, and community.`,
      },
    },
  };
}
