import { useRouter } from "next/router";
import shiki from "shiki";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark as syntaxThemeDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import Header from "../shared/Header";
import Container from "src/shared/layout/Container";
import PageHeader from "src/shared/PageHeader";
import Footer from "../shared/Footer";

const REPLACE_PATHNAME = "%%PATHNAME%%";

export async function getStaticProps() {
  return {
    props: {
      designVersion: "2",
      meta: {
        title: "404 - Page Not Found",
        description: "",
      },
    },
  };
}

export default function Custom404({}) {
  const router = useRouter();
  const pathname = router.asPath;
  const isDocs = pathname.match(/^\/docs/);

  // For debugging
  // console.log("404 - Page not found: ", pathname);

  const title = `404 - Page not found`;
  const lede = `We've triggered an event and a serverless function is forwarding it to the team as you read this.`;

  if (isDocs) {
    return (
      <>
        <h1>{title}</h1>
        <p>{lede}</p>
        <TrackPageNotFound pathname={pathname} />
      </>
    );
  }
  return (
    <div className="font-sans">
      <Header />

      <Container className="my-48">
        <PageHeader title={title} lede={lede} />
      </Container>
      <TrackPageNotFound pathname={pathname} />
      <Footer />
    </div>
  );
}

const TrackPageNotFound = ({ pathname }) => {
  return (
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
        Inngest.event({
          name: "website/page.not.found",
          data: {
            path: "${pathname}",
          },
          v: "2022-01-16.2"
        });
      `,
      }}
    ></script>
  );
};
