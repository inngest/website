import styled from "@emotion/styled";
import Head from "next/head";

import Footer from "../../shared/footer";
import Nav from "../../shared/nav";
import { Wrapper, Inner } from "../../shared/blog";

import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

export default function BlogLayout(props) {
  const scope = JSON.parse(props.post.scope);
  return (
    <>
      <Head>
        <title>{scope.heading} → Inngest Blog</title>
      </Head>
      <Wrapper>
        <Nav />

    {scope.img && (
          <div className="image grid">
            <div className="header col-6-center">
              <Image>
                {scope.img && <img src={scope.img} alt="" className="hero" />}
              </Image>
            </div>
            <div className="grid-line"><span>/01</span></div>
          </div>
    )}

          <Header className="grid">
            <header className="header col-6-center">
                <h1>{scope.heading}</h1>
                <p className="blog--date">
                  {scope.humanDate} &middot; {scope.reading.text}
                </p>
            </header>
            <div className="grid-line"><span>{scope.img ? "/02" : "/01"}</span></div>
          </Header>
          <Main className="grid">
            <main className="col-6-center">
              <MDXRemote
                compiledSource={props.post.compiledSource}
                scope={scope}
              />
            </main>
            <div className="grid-line"><span>{scope.img ? "/03" : "/02" }</span></div>
          </Main>
        <Footer />
      </Wrapper>
    </>
  );
}

const Header = styled.div`
  header {
    padding: var(--section-padding) 0 0;
  }
  .grid-line {
    padding: var(--section-padding) 0 0;
  }

`;

const Main = styled.div`
  > main, .grid-line span {
    padding: var(--section-padding) 0 0;
  }

  main {
    max-width: 800px;
    margin: 0 auto;
  }

  p {
    margin-bottom: 0.25rem;
  }
  ul {
    margin: 2rem 0 0;
  }

  h1 {
    margin: 0 0 2rem;
  }

  h2 {
    margin: 3.5rem 0 1rem;
    font-weight: 600;
    font-size: 1.65rem;
  }

  .blog--date {
    font-size: .85rem;
    opacity: 0.6;
    margin: -3.5rem 0 5rem;
    padding: 0;
    border-left: 2px solid var(--light-grey);
  }

  .blog--callout {
    font-weight: 500;

    box-sizing: content-box;
    padding: 2rem;
    margin: 0 0 8vh;
    border-radius: 10px;

    background-image: linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.08) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0.08) 75%,
      transparent 75%,
      transparent
    );
    background-size: 5px 5px;
  }

  img {
    max-width: 100%;
    max-height: 200px;
    margin: 0 0 50px;
    pointer-events: none;
  }

  img.hero {
    padding: 0 0 50px;
  }

`;

const Image = styled.div`
  text-align: center;
  padding: 4em 0 0;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-height: 25vh;
  }
`;

// This function gets called at build time to figure out which URLs
// we need to statically compile.
//
// These URLs will be treated as individual pages. getStaticProps is
// called for each URL with the slug in params.
export async function getStaticPaths() {
  const fs = require("fs");
  const paths = fs.readdirSync("./pages/blog/_posts/").map((fname) => {
    return `/blog/${fname.replace(/.mdx?/, "")}`;
  });
  return { paths, fallback: false };
}

// This function also gets called at build time to generate specific content.
export async function getStaticProps({ params }) {
  // These are required here as this function is not included in frontend
  // browser builds.
  const fs = require("fs");
  const readingTime = require("reading-time");
  const matter = require("gray-matter");

  const source = fs.readFileSync("./pages/blog/_posts/" + params.slug + ".md");
  const { content, data } = matter(source);

  data.reading = readingTime(content);
  // Format the reading date.
  data.humanDate = data.date.toLocaleDateString();

  // type Post = {
  //   compiledSource: string,
  //   scope: string,
  // }
  const post = await serialize(content, { scope: JSON.stringify(data) });
  return { props: { post } };
}
