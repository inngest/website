import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Head from "next/head";
import Footer from "../shared/footer";
import Nav from "../shared/nav";
import Button from "../shared/Button";
import Code from "../shared/Code";
import Integration, { IntegrationType } from "../shared/Integration";
// Icons
import Hub from "../shared/Icons/Hub";
import Functions from "../shared/Icons/Functions";
import History from "../shared/Icons/History";
import { CheckBanner } from "../shared/Banner";

// Send event preformatted code
const events = {
  cURL: `curl -X POST "https://inn.gs/e/test-key-goes-here-bjm8xj6nji0vzzu0l1k" \\
  -d '{"name": "test.event", "data": { "email": "gob@bluth-dev.com" } }'`,
  JavaScript: ``,
  Go: `package main

import (
	"context"
	"os"

	"github.com/inngest/inngestgo"
)

func SendEvent(ctx context.Context) {
	// Create a new client
	client := inngestgo.NewClient(os.Getenv("INGEST_KEY"))
	// Send an event
	client.Send(ctx, inngestgo.Event{
		Name: "user.created",
		Data: map[string]interface{}{
			"plan": "pro",
			"ip":   "10.0.0.10",
		},
		User: map[string]interface{}{
			// Use the external_id field within User so that we can add context
			// for audit trails.
			inngestgo.ExternalID: user.ID,
			inngestgo.Email:      user.Email,
		},
		Version:   "2022-01-01.01",
		Timestamp: inngestgo.Now(),
	})
}`,
};

const integrations = [
  {
    name: "Stripe",
    logo: "/integrations/stripe.svg",
    category: "Payments & Billing",
    type: [IntegrationType.EVENTS],
  },
  {
    name: "Twilio",
    logo: "/integrations/twilio.svg",
    category: "Messaging & Communication",
    type: [IntegrationType.EVENTS],
  },
  {
    name: "Mailchimp",
    logo: "/integrations/mailchimp.svg",
    category: "Messaging & Communication",
    type: [IntegrationType.EVENTS],
  },
  {
    name: "Salesforce",
    logo: "/integrations/salesforce.svg",
    category: "Sales Enablement",
    type: [IntegrationType.EVENTS],
  },
  {
    name: "Chatwoot",
    logo: "/integrations/chatwoot.svg",
    category: "Customer support",
    type: [IntegrationType.EVENTS],
  },
  {
    name: "GitHub",
    logo: "/integrations/github.svg",
    category: "Software Collaboration",
    type: [IntegrationType.EVENTS],
  },
];

const SectionHeader: React.FC<{
  label?: string;
  title: string;
  subtitle: string;
  counter?: string;
}> = ({ label, title, subtitle, counter }) => {
  return (
    <div className="grid section-header">
      <div className="grid-center-6">
        <span className="section-label">{label}</span>
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
      </div>
      <div className="grid-line">{counter && <span>{counter}</span>}</div>
    </div>
  );
};

// TODO: move these into env vars
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
    <Wrapper>
      <Head>
        <title>
          Inngest → build serverless event-driven functions in minutes
        </title>
        <link rel="icon" href="/favicon.png" />
        <meta
          property="og:title"
          content="Inngest - build serverless event-driven functions in minutes"
        />
        <meta
          property="og:description"
          content="Create, deploy, and monitor event-driven serverless functions with confidence."
        />
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

      <Nav border />
      <div className="grid hero-grid">
        <Hero>
          <h1>Make event-driven apps fun to build</h1>
          <p className="subheading">
            Deploy serverless functions in minutes.
            <br />
            No infra. No servers. Zero YAML.
          </p>

          <Button kind="primary" href="/sign-up">
            Start building
          </Button>
          <Button kind="outline" href="/sign-up">
            Explore docs →
          </Button>
        </Hero>
        <div className="grid-line" />
      </div>
      <CheckBanner
        className="monospace"
        list={[
          "Developer CLI",
          "Auto-gen'd types & schemas",
          "Retries & replays built in",
        ]}
      />

      <SectionHeader
        label="Introducing our"
        title="Event mesh"
        subtitle="Everything you need to build production ready event driven apps."
        counter="/01"
      />

      <div className="grid">
        <div className="grid-center-6 relative">
          <img
            src="/assets/graphic.svg"
            alt="Event driven serverless function example"
            className="full-width img-shadow"
          />
        </div>
        <div className="grid-line" />
      </div>

      <SectionHeader
        label="Events"
        title="How it works"
        subtitle="Our Event Mesh makes it easy to build event-driven apps."
        counter="/02"
      />

      <HIW className="grid">
        <div className="grid-2-offset-2">
          <Hub />
          <h4>One event hub</h4>
          <p>
            We ingest all your events via our one-click integrations, SDKs, or
            webhooks.
          </p>
        </div>
        <div className="grid-2">
          <Functions />
          <h4>Serverless Functions</h4>
          <p>
            Your code is executed instantly against the events you specify.
            Automatic retries built-in.
          </p>
        </div>
        <div className="grid-2">
          <History />
          <h4>Unified History</h4>
          <p>
            View logging, payload data, and audit-trails for your events and
            functions together in one place.
          </p>
        </div>
        <div className="grid-line" />
      </HIW>

      <SectionHeader
        label="Events"
        title="Send your events from anywhere"
        subtitle="Use our SDKs or webhooks to send events from your app"
        counter="/03"
      />

      <div className="section code-grid grid">
        <div className="code grid-center-6">
          <Code code={events} />
          <p className="text-center">Get started with an SDK: </p>
        </div>

        <div className="grid-line">
          <span>/03</span>
        </div>
      </div>

      <div className="section grid">
        <div className="grid-center-6">
          <h3>
            Automatically stream events from 3rd party apps with our
            integrations
          </h3>
          <div className="integrations">
            {integrations.map((i) => (
              <Integration {...i} key={i.name} />
            ))}
          </div>
        </div>
        <div className="grid-line" />
      </div>

      <SectionHeader
        label="DX First"
        title="Build with superpowers"
        subtitle="Create, deploy, and monitor event-driven serverless functions with confidence."
        counter="/04"
      />

      <div style={{ marginTop: 100 }}>
        <Footer />
      </div>
    </Wrapper>
  );
}

// Wrapper defines a top-level scope for nesting home-specific CSS classes within.
const Wrapper = styled.div`
  .code {
    padding: 2rem 0 10vh;
    p {
      margin: 2rem 0 0;
    }
  }

  .section-header > div {
    padding-top: 20vh;
  }

  .code-grid {
    > div:first-of-type {
      padding-top: 15vh;
    }

    .grid-line span {
      padding-top: calc(15vh + 1rem);
    }
  }

  .hero-grid .grid-line,
  .code-grid .grid-line {
    grid-row-end: 3;
  }

  .integrations {
    padding: 2rem 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: var(--grid-gap);
  }
`;

const Hero = styled.div`
  padding: 12vh 0;
  grid-column: 2 / -5;

  p {
    padding: 0 0 4rem;
  }

  .button {
    font-size: 1.375rem;
    font-family: var(--font-mono);
  }
`;

const Section = styled.div`
  > div {
    padding: 10rem 0;
  }
  img {
    margin: 5rem 0 2rem;
    box-shadow: 0 10px 100px rgba(var(--black-rgb), 0.3);
    width: 100%;
    border: 1px solid rgba(var(--black-rgb), 0.2);
    pointer-events: none;
  }
`;

const HIW = styled.div`
  > div {
    padding: 3rem 1rem 3rem 0;
  }
  svg {
    margin: 0 0 1rem;
  }
`;
