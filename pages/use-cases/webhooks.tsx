import getLibrary, { LibraryData } from "../../utils/library";
import Footer from "../../shared/footer";
import Callout from "../../shared/Callout";
import Header from "./_header";
import UseCases from "./_useCases";
import styled from "@emotion/styled";

const CATEGORY="webhooks"

export default function Webhooks(props: { useCases: LibraryData }) {
  return (
    <div>
      <Header
        category={CATEGORY}
        header="Manage webhooks in minutes, with&nbsp;zero&nbsp;infra"
        subheader="Using Inngest, you can create a production-ready environment to receive webhooks and trigger serverless functions automatically — zero downtime, zero configuration, zero infra."
      />

      <Content>
        <h2>What you can build using webhooks</h2>
        <p>A non-exhaustive list :)</p>
        <UseCases items={props.useCases || []} category={CATEGORY} />
      </Content>

      <Callout
        small="Looking for a fast and easy way to manage webhook endpoints?"
        ctaRef="webhook-callout"
        style={{ margin: "10vh 0" }}
      />

      <Footer />
    </div>
  );
}

export async function getStaticProps(_context: any) {
  // This fetches the library via async functionality on the server before rendering,
  // letting us dynamically generate the use cases.
  const library = await getLibrary();

  return {
    props: {
      useCases: library.forCategory(CATEGORY),
    },
  };
}

const Content = styled.div`
  max-width: var(--max-page-width);
  margin: 0 auto;
`
