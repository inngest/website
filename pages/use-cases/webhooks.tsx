import getLibrary, { LibraryData } from "../../utils/library";
import Footer from "../../shared/footer";
import Callout from "../../shared/Callout";
import SectionHeader from "../../shared/SectionHeader";
import Header from "./_header";
import UseCases from "./_useCases";
import styled from "@emotion/styled";

const CATEGORY = "webhooks";

export default function Webhooks(props: { useCases: LibraryData }) {
  return (
    <div>
      <Header
        category={CATEGORY}
        header="Manage webhooks in minutes, with&nbsp;zero&nbsp;infra"
        subheader="Using Inngest, you can create a production-ready environment to receive webhooks and trigger serverless functions automatically — zero downtime, zero configuration, zero infra."
      />

      <Content>
        <SectionHeader
          align="left"
          title="Save time by letting us handle the hidden complexity of webhooks for you"
          subtitle="Our platform handles the nuances of managing webhooks, letting you focus on your product."
        />

        <Features>
          <div>
            <h3>Idempotency</h3>
            <p>Almost all webhooks are at least once:  you might receive the same request multiple times. <strong>We handle idempotency out of the box</strong>, making sure that your logic only runs the first time the same webhook is received.</p>
          </div>
          <div>
            <h3>Always on</h3>
            <p><strong>Our architecture ensures that we’re highly available</strong> and are always ready to receive your webhook, so that you don’t have to worry about downtime or missing important data for business critical functionality.</p>
          </div>
          <div>
            <h3>Replays, retries & local testing</h3>
            <p>We store every payload you receive, allowing you to replay webhooks, manage retries, and locally run and test your functions. We also generate fully typed SDKs for every payload you receive.</p>
          </div>
          <div>
            <h3>Version management</h3>
            <p>It’s a given that requirements change. Inngest allows you to rapidly develop and deploy new functionality, with a full version history for audits and record keeping.</p>
          </div>

        </Features>

        <h2>What you can build using webhooks</h2>
        <p style={{ opacity: .5 }}>A non-exhaustive list :)</p>
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
`;

const Features = styled.div`
  --spacing: 3rem;

  display: grid;
  max-width: var(--max-page-width);
  grid-template-columns: repeat(4, 1fr);
  grid-gap: var(--spacing);

  margin: 0 auto var(--section-padding);
`;
