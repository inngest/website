import Head from "next/head";

import { loadMarkdownFilesMetadata } from "src/utils/markdown";
import BlogPostList from "src/components/Blog/BlogPostList";
import BlogHeader from "src/components/Blog/BlogHeader";
import Container from "src/shared/layout/Container";
import Nav from "src/components/Nav";
import { type MDXBlogPost, BLOG_CATEGORIES } from "src/components/Blog";

type StaticProps = {
  serializedPosts: string[];
  categoryTitle: string;
  meta: {
    title: string;
    description: string;
  };
};

export default function BlogCategory(props: StaticProps) {
  const posts: MDXBlogPost[] = props.serializedPosts.map((p) => JSON.parse(p));

  return (
    <>
      <Head>
        <title>Inngest - {props.meta.title}</title>
        <meta name="description" content={props.meta.description}></meta>
        <meta property="og:title" content={props.meta.title} />
        <meta property="og:description" content={props.meta.description} />
      </Head>

      <div className="font-sans">
        <Nav />
        <Container className="pt-8">
          <BlogHeader description={props.categoryTitle} />
          <div className="pt-16">
            <BlogPostList posts={posts} />
          </div>
        </Container>
      </div>
    </>
  );
}

export async function getStaticProps({
  params,
}: {
  params: { category: string };
}): Promise<{ props: StaticProps }> {
  const posts = await loadMarkdownFilesMetadata<MDXBlogPost>("blog/_posts");
  const filteredPosts = posts.filter((p) => p.category === params.category);
  const serializedPosts = filteredPosts.map((p) => JSON.stringify(p));
  const title = BLOG_CATEGORIES[params.category];

  return {
    props: {
      serializedPosts,
      categoryTitle: title,
      meta: {
        title: `Product & Engineering Blog - ${title}`,
        description: `Blog posts covering the topic of ${title}`,
      },
    },
  };
}

export async function getStaticPaths() {
  const categories = Object.keys(BLOG_CATEGORIES);
  const paths = categories.map((c) => `/blog/category/${c}`);
  return { paths, fallback: false };
}
