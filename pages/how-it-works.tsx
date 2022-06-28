import styled from "@emotion/styled";
import Button from "../shared/Button";
import Script from "next/script";
import Head from "next/head";
import Footer from "../shared/footer";
import Nav from "../shared/nav";
import ContentBlock from "../shared/ContentBlock";
import Section from "../shared/Section";

export default function HowItWorks() {
  return (
    <Wrapper>
      <Head>
        <title>
          Inngest → build serverless event-driven functions in minutes
        </title>
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
        <Script src="/inngest-sdk.js" defer async></Script>
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "e2fa9f28c34844e4a0d29351b8730579"}'
        ></Script>
      </Head>

      <Nav />

      <Hero>
        <h1>Made for developers</h1>
        <p>
          Simple to get started, complex enough to scale. <br />
        </p>
      </Hero>

      <Section>
        <div>
          <ContentBlock
            heading="Serverless scalability"
            text={
              <>
                <p>
                  We separated workers from queues to make background jobs
                  declarative and serverless - no infrastructure required.
                  Here's how it works:
                </p>

                <p>
                  The events API ingests events via HTTP - which works in every
                  language - and pushes them into an event stream.
                </p>

                <p>
                  Our execution engine watches the incoming event stream and
                  matches events to functions. We then schedule your functions
                  in our serverless queue, where our drivers run each step of
                  your function. Everything is handled for you, except for your
                  business logic.
                </p>
              </>
            }
            image="/assets/serverless-scalability.png"
          />

          <ContentBlock
            layout="reverse"
            heading="Distributed execution"
            text={
              <>
                <p>
                  We designed our execution engine to support multiple drivers.
                  You can run functions however they're packaged — Docker
                  containers, Lambda functions, Netlify and Vercel API
                  endpoints, Nomad and Kubernetes clusters or, coming soon,
                  internal functions in your monorepo via RPC.
                </p>

                <p>
                  This allows you to create and publish functions however they
                  fit into your stack, and test them locally with no extra
                  steps.
                </p>

                <p>
                  Our execution engine is{" "}
                  <a href="https://www.github.com/inngest/inngest-cli">
                    open source
                  </a>{" "}
                  and allows you to write your own drivers.
                </p>
              </>
            }
            image="/assets/execution.png"
          />

          <ContentBlock
            heading="State and visibility"
            text={
              <>
                <p>
                  We store every event you send, and record all of the state
                  that each step of your function creates — using swappable
                  state interfaces that you can choose to self host.
                </p>

                <p>
                  This allows you to gain full visibility into how your
                  functions run, the data produced within each step of the
                  function, to trigger manual retries with modified data and to
                  test new versions of a function historcally.
                </p>

                <p>
                  And, because functions are decoupled from their triggers, you
                  can deploy new functions instantly, without changes to your
                  stack, and version each function independently from the
                  triggering event.
                </p>
              </>
            }
            image="/assets/state.png"
          />
        </div>
      </Section>

      <Section theme="dark">
        <header>
          <h2>
            The benefits of events
            <br />
            with the flexibility of queues.
          </h2>
        </header>
        <Grid>
          <div>
            <h4>Event-driven</h4>
            <p>
              Leverage the power of event driven architectures to build and ship
              functionality faster, with zero extra effort. Events already power
              customer platforms, BI, ML, and microservices.
            </p>
          </div>
          <div>
            <h4>Proven architecture</h4>
            <p>
              Inngest's platform sits on top of proven message brokers that
              power the largest companies, scaling from zero to billions of
              messages per day.
            </p>
          </div>
          <div>
            <h4>Standards based</h4>
            <p>
              Embrace standards to ship faster, in every language, without
              worrying about compatibolity or support. Every developer can jump
              in.
            </p>
          </div>
        </Grid>

        <div className="cta-container">
          <p>Learn more about the architecture in our docs:</p>
          <Button
            size="medium"
            kind="primary"
            href="/docs/high-level-architecture"
          >
            Read the docs
          </Button>
        </div>
      </Section>

      <Footer />
    </Wrapper>
  );
}

/**

What would you want to know here?

- A high-level architecture and how you actually use it.

Serverless: no infra required (unless you want to self host).

1. Publish
2. Execute
3. DAGs, stateful, we handle the scheduling - you do nothing.

- Conditional execution
- Scheduler
- Drivers
- Backing state stores

**/

const Wrapper = styled.div``;

const Hero = styled.div`
  margin: 6rem 0 0;
  padding: 0 1rem;
  text-align: center;
  p {
    margin: 1rem auto;
  }
`;

const Grid = styled.div`
  max-width: 1200px;
  margin: 8rem auto 6rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 4rem;

  h4 {
    margin: 0 0 1rem;
  }

  + div > p {
    margin: 0 0 1rem;
  }
`;
