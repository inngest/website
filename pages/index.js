import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Head from "next/head";
import Footer from "../shared/footer";
import Nav from "../shared/nav";
import Button from "../shared/Button";

import Hub from "../shared/Icons/Hub";
import Functions from "../shared/Icons/Functions";
import History from "../shared/Icons/History";

import { CheckBanner } from "../shared/Banner";


// TODO: move these into env vars
// prod key
export const INGEST_KEY =
  "BIjxBrM6URqxAu0XgIAae5HgBCv8l_LodmdGonFCfngjhwIgQEbvbUUQTwvFMHO21vxCJEGsC7KPdXEzdXgOAQ";

// test key
// export const INGEST_KEY = 'MnzaTCk7Se8i74hA141bZGS-NY9P39RSzYFbxanIHyV2VDNu1fwrns2xBQCEGdIb9XRPtzbp0zdRPjtnA1APTQ';

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const Inngest = globalThis.Inngest;
    if (!Inngest) {
      console.warn("Inngest not found");
      return;
    }
    Inngest.init(INGEST_KEY);
    Inngest.event({
      name: "marketing.signup",
      data: { email },
      user: { email },
    });
    setEmail("");
    setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>
          Inngest → build serverless event-driven functions in minutes
        </title>
        <link rel="icon" href="/favicon.png" />
        <meta property="og:title" content="Inngest - build serverless event-driven functions in minutes" />
        <meta property="og:description" content="Create, deploy, and monitor event-driven serverless functions with confidence." />
        <meta property="og:url" content="https://www.inngest.com" />
        <meta property="og:image" content="/logo.svg" />
        <meta
          property="og:description"
          content="Build event serverless event-driven systems in seconds"
        />
        <script src="/inngest-sdk.js"></script>
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "e2fa9f28c34844e4a0d29351b8730579"}'
        ></script>
      </Head>

      <Nav />

      <Hero className="grid">
        <div className="grid-center-8">
          <h1>Make event-driven apps fun to build</h1>
          <p className="subheading">
            Deploy serverless functions in minutes.<br />
            No infra.  No servers.  No YAML.
          </p>

          <Button kind="primary" href="/sign-up">Start building</Button>
          <Button kind="outline" href="/sign-up">Explore docs →</Button>
        </div>
      </Hero>

      <CheckBanner
        className="monospace"
        list={["Developer CLI", "Auto-gen'd types & schemas", "Retries & replays built in"]}
      />

      <Section className="grid">
        <div className="grid-center-6">
          <span className="section-label">Introducing our</span>
          <h2>Event mesh</h2>
          <h3>Everything you need to build production ready event driven apps.</h3>

          <img src="/assets/graphic.svg" alt="Event driven serverless function example" className="full-width img-shadow" />
        </div>
      </Section>

      <div className="grid">
        <div className="grid-center-6">
          <h2>How it works</h2>
          <h3>Our Event Mesh makes it easy to build event-driven apps.</h3>
        </div>
      </div>

      <HIW className="grid">
        <div className="grid-2-offset-2">
          <Hub />
          <h4>One event hub</h4>
          <p>We ingest all your events via our one-click integrations, SDKs, or webhooks.</p>
        </div>
        <div className="grid-2">
          <Functions />
          <h4>Serverless Functions</h4>
          <p>Your code is executed instantly against the events you specify. Automatic retries built-in.</p>
        </div>
        <div className="grid-2">
          <History />
          <h4>Unified History</h4>
          <p>View logging, payload data, and audit-trails for your events and functions together in one place.</p>
        </div>
      </HIW>

      <div style={{ marginTop: 100 }}>
        <Footer />
      </div>
    </>
  );
}

const Hero = styled.div`
  padding: 12vh 0;
  > div {
    grid-column: 2 / -5;
  }

  p {
    padding: 0 0 4rem;
  }

  .button {
    font-size: 1.375rem;
    font-family: var(--font-mono);
  }
`;

const Section = styled.div`
  padding: 10rem 0;

  img {
    margin: 5rem 0 2rem;
    box-shadow: 0 10px 100px rgba(var(--black-rgb), 0.3);
    width: 100%;
    border: 1px solid rgba(var(--black-rgb), 0.2);
    pointer-events: none;
  }
`;

const HIW = styled.div`
  margin: 3rem 0;
  svg {
    margin: 0 0 1rem;
  }
`
