import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { Rss } from "react-feather";

import { RiCalendarLine } from "@remixicon/react";
import ArrowRight from "src/shared/Icons/ArrowRight";
import { RiArrowRightLine } from "@remixicon/react";
import Footer from "src/components/RedesignedLanding/Footer";
import Header from "src/components/RedesignedLanding/Header/Header";
import Container from "../shared/layout/Container";
import Tags from "../shared/Blog/Tags";
import { loadMarkdownFilesMetadata } from "../utils/markdown";
import BlogHeader from "src/components/Blog/BlogHeader";
import BlogPostList from "src/components/Blog/BlogPostList";
import { type MDXBlogPost } from "src/components/Blog";

export default function BlogIndex(props) {
  const router = useRouter();
  const { showHidden } = router.query;

  const content: MDXBlogPost[] = props.content.map(JSON.parse);
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

      <div className="bg-stone-950 font-sans">
        <Header />

        <Container className="pt-8">
          <BlogHeader description={description} />

          <div className="pt-16">
            {focus && (
              <a
                className="group relative mb-32 flex flex-col-reverse rounded-lg border border-stone-600 bg-stone-700 shadow-lg transition-all lg:flex-row xl:max-w-[1160px]"
                href={focus.redirect ?? `/blog/${focus.slug}`}
              >
                <div
                  className={`${
                    focus.image ? "lg:w-2/5" : "w-full"
                  } relative z-10 flex flex-col items-start justify-between p-8`}
                >
                  <div className="text-alwaysBlack">
                    <span className="mb-3 inline-flex rounded bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-50">
                      Latest Post
                    </span>
                    <h2 className="mb-1 text-xl font-medium text-stone-50 md:text-2xl lg:text-xl xl:text-2xl">
                      {focus.heading}
                    </h2>
                    <p className="mb-4 flex items-center gap-1 text-sm font-medium text-stone-50">
                      <RiCalendarLine className="h-3 w-3" />
                      {focus.humanDate} <Tags tags={focus.tags || []} />
                    </p>
                    <p className="text-stone-50">{focus.subtitle}</p>
                  </div>
                  <span className="mt-4 flex flex-row items-center gap-1 rounded-lg bg-inngestLux px-4 py-1.5 text-sm font-medium text-stone-950 group-hover:bg-inngestLuxDark">
                    Read article
                    <RiArrowRightLine className="h-4 w-4" />
                  </span>
                </div>
                {focus.image && (
                  <div className="relative flex p-2 lg:w-3/5">
                    <Image
                      className="z-10 m-auto w-full rounded-lg group-hover:rounded-lg"
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
  const posts = await loadMarkdownFilesMetadata<MDXBlogPost>("content/blog");
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
