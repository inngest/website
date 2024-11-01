import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { Rss } from "react-feather";

import { RiCalendarLine } from "@remixicon/react";
import ArrowRight from "src/shared/Icons/ArrowRight";
import { RiArrowRightLine } from "@remixicon/react";
import Footer from "../shared/Footer";
import Header from "../shared/Header";
import Container from "../shared/layout/Container";
import Tags from "../shared/Blog/Tags";
import {
  loadMarkdownFilesMetadata,
  type MDXFileMetadata,
} from "../utils/markdown";
import BlogHeader from "src/components/Blog/BlogHeader";
import BlogPostList from "src/components/Blog/BlogPostList";
import { type BlogPost } from "src/components/Blog";
// import { LaunchWeekBanner } from "./index";

export default function BlogIndex(props) {
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
        <title>Inngest - Product & Engineering blog</title>
        <meta name="description" content={description}></meta>
        <meta
          property="og:title"
          content="Inngest - Product & Engineering blog"
        />
        <meta property="og:description" content={description} />
      </Head>

      <div className="font-sans">
        <Header />

        {/* <LaunchWeekBanner urlRef="blog-feed-banner" /> */}

        <Container className="pt-8">
          <BlogHeader description={description} />

          <div className="pt-16">
            {focus && (
              <a
                className="relative flex flex-col-reverse lg:flex-row xl:max-w-[1160px] transition-all bg-[rgba(var(--color-foreground-success)/0.9)] hover:bg-[rgba(var(--color-foreground-success)/1)] rounded-lg mb-32 group shadow-lg"
                href={focus.redirect ?? `/blog/${focus.slug}`}
              >
                <div className="absolute top-0 bottom-0 -left-[40px] -right-[40px] rounded-lg bg-[rgba(var(--color-foreground-success)/0.2)] rotate-1 -z-0 mx-5"></div>
                <div
                  className={`${
                    focus.image ? "lg:w-2/5" : "w-full"
                  } p-8 flex flex-col items-start justify-between relative z-10`}
                >
                  <div className="text-alwaysBlack">
                    <span className="inline-flex mb-3 text-xs font-semibold bg-[rgba(var(--color-carbon-50)/0.2)] px-3 py-1.5 rounded">
                      Latest Post
                    </span>
                    <h2 className="text-xl md:text-2xl lg:text-xl xl:text-2xl mb-1 font-medium">
                      {focus.heading}
                    </h2>
                    <p className="text-sm font-medium mb-4 flex gap-1 items-center">
                      <RiCalendarLine className="h-3 w-3" />
                      {focus.humanDate} <Tags tags={focus.tags || []} />
                    </p>
                    <p className="">{focus.subtitle}</p>
                  </div>
                  <span className="flex flex-row items-center gap-1 px-4 text-sm font-medium inline-flex mt-4 bg-carbon-900 text-carbon-50 py-1.5 rounded-lg group-hover:bg-carbon-800">
                    Read article
                    <RiArrowRightLine className="h-4 w-4" />
                  </span>
                </div>
                {focus.image && (
                  <div className="lg:w-3/5 flex p-2 relative">
                    <Image
                      className="z-10 w-full m-auto rounded-lg group-hover:rounded-lg"
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

            <BlogPostList posts={rest} />
          </div>
        </Container>
        <Footer />
      </div>
    </>
  );
}

// This function also gets called at build time to generate specific content.
export async function getStaticProps() {
  const posts = await loadMarkdownFilesMetadata<BlogPost>("blog/_posts");
  // If a post is set to featured=false, do not show on main blog feed
  // This can be used for less important posts that may be directly linked to from other places
  const filteredPosts = posts.filter((p) => p?.featured !== false);
  const content = filteredPosts.map((p) => JSON.stringify(p));

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
