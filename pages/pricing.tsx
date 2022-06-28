import { useEffect } from "react";
import styled from "@emotion/styled";
import Head from "next/head";
import Footer from "../shared/footer";
import Nav from "../shared/nav";
import Content from "../shared/content";
import Callout from "../shared/Callout";

import Block from "../shared/Block";
import IconList from "../shared/IconList";
import Button from "../shared/Button";

import Workflow from "../shared/Icons/Workflow";
import Language from "../shared/Icons/Language";
import ArrowCaretCircleRight from "../shared/Icons/ArrowCaretCircleRight";
import Plus from "../shared/Icons/Plus";
import ListCheck from "../shared/Icons/ListCheck";
import UserVoice from "../shared/Icons/UserVoice";

import Functions from "../shared/Icons/Play";
import UsersGroup from "../shared/Icons/UsersGroup";

const PLANS = [
  {
    name: "Community",
    cost: "free",
    description: (
      <>
        Powerful enough to be useful, and <strong>always free</strong>. Perfect
        for getting started.
      </>
    ),
    cta: {
      href: "/sign-up?ref=pricing-free",
      text: "Sign up for free →",
    },
    features: [
      {
        icon: ArrowCaretCircleRight,
        quantity: "3",
        text: "functions",
      },
      {
        icon: Language,
        quantity: "1,000",
        text: "function steps/month",
      },
      {
        icon: UsersGroup,
        quantity: "3",
        text: "seats",
      },
      {
        icon: ListCheck,
        quantity: "1 week",
        text: "log retention",
      },
    ],
  },
  {
    name: "Startup",
    cost: "$50/mo",
    description: <>Get to market fast.</>,
    cta: {
      href: "/sign-up?ref=pricing-startup",
      text: "Start building →",
    },
    features: [
      {
        icon: ArrowCaretCircleRight,
        quantity: "25",
        text: "functions",
      },
      {
        icon: Language,
        quantity: "25,000",
        text: "function steps/month",
      },
      {
        icon: UsersGroup,
        quantity: "5",
        text: "seats",
      },
      {
        icon: ListCheck,
        quantity: "1 month",
        text: "log retention",
      },
    ],
  },
  {
    name: "Team",
    cost: "$200/mo",
    description: <>More room to grow.</>,
    cta: {
      href: "/sign-up?ref=pricing-team",
      text: "Start building →",
    },
    features: [
      {
        icon: ArrowCaretCircleRight,
        quantity: "100",
        text: "functions",
      },
      {
        icon: Language,
        quantity: "100,000",
        text: "function steps/month",
      },
      {
        icon: UsersGroup,
        quantity: "20",
        text: "seats",
      },
      {
        icon: ListCheck,
        quantity: "3 month",
        text: "log retention",
      },
      {
        icon: UserVoice,
        quantity: "Dedicated",
        text: "support",
      },
    ],
  },
  {
    name: "Custom",
    cost: "Flexible pricing",
    description: <>Powerful access for any scale.</>,
    cta: {
      href: "/contact?ref=pricing-advanced",
      text: "Get in touch",
    },
    features: [
      {
        icon: ArrowCaretCircleRight,
        quantity: "Custom",
        text: "functions",
      },
      {
        icon: Language,
        quantity: "Millions",
        text: "of function steps/month",
      },
      {
        icon: UsersGroup,
        quantity: "Custom",
        text: "seats",
      },
      {
        icon: ListCheck,
        quantity: "6+ month",
        text: "log retention",
      },
      {
        icon: ListCheck,
        quantity: "6+ month",
        text: "log retention",
      },
      {
        icon: UserVoice,
        quantity: "Dedicated",
        text: "support",
      },
    ],
  },
];

export default function Pricing() {
  const toggleFAQ = (e) => {
    e.currentTarget.classList.toggle("active");
  };

  return (
    <>
      <Head>
        <title>Inngest → programmable event platform pricing</title>
        <meta property="og:title" content="Inngest" />
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

      <Hero>
        <h2>
          Simple pricing.
          <br />
          Powerful functionality.
        </h2>
      </Hero>

      <Content>
        <Heading>Cloud</Heading>
        <p>
          Start sending events and running functions with our fully managed
          solution, for free.
        </p>
        <Grid>
          <FreePlanBlock visibleOn="desktop" color="primary">
            <PlanHeader flexDirection="row">
              <div>
                <h4>{PLANS[0].name}</h4>
                <p>{PLANS[0].description}</p>
              </div>
              <div>
                <Button kind="outlineHighContrast" href={PLANS[0].cta.href}>
                  {PLANS[0].cta.text}
                </Button>
              </div>
            </PlanHeader>
            <IconList items={PLANS[0].features} />
          </FreePlanBlock>
          <FreePlanBlock visibleOn="mobile" color="primary">
            <PlanHeader flexDirection="column">
              <div>
                <h4>{PLANS[0].name}</h4>
                <p>{PLANS[0].description}</p>
              </div>
            </PlanHeader>
            <IconList direction="vertical" items={PLANS[0].features} />
            <Button kind="outlineHighContrast" href={PLANS[0].cta.href}>
              {PLANS[0].cta.text}
            </Button>
          </FreePlanBlock>

          {PLANS.slice(1).map((plan, idx) => (
            <PlanBlock key={plan.name}>
              <PlanHeader flexDirection="column">
                <div>
                  <h4>{plan.name}</h4>
                  <p>{plan.description}</p>
                  <p className="cost">{plan.cost}</p>
                </div>
              </PlanHeader>
              <IconList direction="vertical" items={plan.features} />
              <Button kind="outlineHighContrast" href={plan.cta.href}>
                {plan.cta.text}
              </Button>
            </PlanBlock>
          ))}
        </Grid>

        <AllPlansInfo>
          All plans include uncapped events per month, scheduled functions,
          support via Email & Discord.
        </AllPlansInfo>

        <SelfHost>
          <Heading>Self hosted</Heading>
          <p>
            Host and manage our events API and scheduling environment for full
            control, <br />
            with full support and custom cloud integration offered at scale.
          </p>

          <Button
            kind="outline"
            href="https://www.github.com/inngest/inngest-cli"
            target="_blank"
          >
            Get the open-source project
          </Button>
        </SelfHost>

        <FAQGrid>
          <h2 style={{ margin: "2rem 0" }}>FAQs</h2>
          <div onClick={toggleFAQ}>
            <h4>What's a "function?"</h4>
            <p>
              A function is a single serverless function or step function.
              Functions can run automatically (each time an event is received),
              on a schedule, or manually via forms (in the case of internal
              tools, or one-offs).
            </p>
            <p>
              Functions allow you to chain logic together, coordinate between
              events, and create complex user flows and operational logic for
              your company.
            </p>
          </div>

          <div onClick={toggleFAQ}>
            <h4>What's a "function step?"</h4>
            <p>
              A single function can have multiple steps. Each step is its own
              code. Our billing works based off of each step ran within your
              function.{" "}
              <a href="https://www.inngest.com/docs/functions/step-functions">
                You can read more about step functions here
              </a>
            </p>
          </div>

          <div onClick={toggleFAQ}>
            <h4>What languages do you support?</h4>
            <p>
              Every language. Anything that you can put in a Docker container we
              can run from JavaScript to Go to Python to Perl to Bash.
            </p>
          </div>

          <div onClick={toggleFAQ}>
            <h4>Do you charge for events?</h4>
            <p>
              We're currently accepting all events, uncapped. Our "soft" limit
              is 1M events/mo across free and paid plans, and from 50M events/mo
              on custom plans.
            </p>
          </div>

          <div onClick={toggleFAQ}>
            <h4>What are the resources limits?</h4>
            <p>
              Free accounts are limited to 128mb of ram and a maximum runtime of
              10 seconds per function. Paid accounts can utilize 1GB of ram and
              have a runtime limit of 60 seconds per function. Advanced accounts
              can use up to 16GB of ram and can run functions for up to 6 hours;
              if you need this functionality{" "}
              <a href="/contact">get in touch with us</a>.
            </p>
          </div>

          <div onClick={toggleFAQ}>
            <h4>What if I need to run more functions?</h4>
            <p>
              That's okay! We'll alert you when you're nearing your cap and will
              throttle your functions after hitting the limit. You can purchase
              more capacity at the same rate as your plan includes.
            </p>
            <p>
              We also offer overage forgiveness for those times that we all know
              happen. We dislike surprise costs as much as you.
            </p>
          </div>

          <div onClick={toggleFAQ}>
            <h4>What is event coordination, and how can I use it?</h4>
            <p>
              Event coordination allows you to wait for specific events from
              within a function. For example, after creating a shopping cart you
              might want to wait for the "order created" event for up to 24
              hours. If this event is received, the person who created the
              shopping cart checked out. If the event isn't received within 24
              hours, you can run logic to handle churn.
            </p>
            <p>
              We allow you to coordinate between events and wait up to 6 months
              for new events. That's... quite some time.
            </p>
          </div>

          <div onClick={toggleFAQ}>
            <h4>Is there a limit to how often I can run scheduled function?</h4>
            <p>
              In the community edition, functions are limited to 15 minute
              intervals and may be throttled for fair usage. Paid plans can run
              scheduled functions every minute, and are not subject to
              throttling. Custom plans have their own dedicated pools for
              managing functions.
            </p>
          </div>

          <div onClick={toggleFAQ}>
            <h4>Can I self-host Inngest?</h4>
            <p>
              If you'd like to self-host Inngest or the executor platform{" "}
              <a href="/contact">reach out to us with your needs</a>.
            </p>
          </div>
        </FAQGrid>

        <Callout ctaRef="pricing-callout-end" />
      </Content>

      <div style={{ marginTop: 100 }}>
        <Footer />
      </div>
    </>
  );
}

const Hero = styled.div`
  padding: calc(var(--nav-height) + 10vh) 0 10vh;
  margin-top: calc(var(--nav-height) * -1);
  text-align: center;

  h1 + p {
    font-size: 22px;
    line-height: 1.45;
    opacity: 0.8;
  }
  p {
    margin: 1rem 0 0;
    font-family: var(--font);
  }
`;

const PlanHeader = styled.div<{
  flexDirection: "row" | "column";
}>`
  display: flex;
  flex-direction: ${(props) => props.flexDirection || "row"};
  justify-content: space-between;
  margin-bottom: 1.5rem;

  @media (max-width: 1000px) {
    flex-direction: column;
  }

  p {
    margin: 1rem 0;
  }

  .cost {
    font-size: 1.4rem;
  }
`;

const Heading = styled.h4`
  font-weight: normal;
  text-align: center;
  margin: 2rem 0 0.25rem;

  & + p {
    text-align: center;
    font-size: 0.9rem;
    opacity: 0.7;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  margin: 2rem 0;

  small {
    opacity: 0.5;
    font-size: 100%;
  }
  @media (max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const PlanBlock = styled(Block)`
  display: flex;
  flex-direction: column;

  background: linear-gradient(
    135deg,
    hsl(330deg 82% 10%) 0%,
    hsl(239deg 82% 10%) 100%
  );

  .icon-list {
    flex-grow: 1;
    margin-bottom: 2rem;
  }
`;

const FreePlanBlock = styled(PlanBlock)<{ visibleOn: string }>`
  grid-column: 1 / span 3;

  display: ${({ visibleOn }) => (visibleOn === "desktop" ? "flex" : "none")};

  color: var(--black);
  background: linear-gradient(
    135deg,
    hsl(332deg 30% 95%) 0%,
    hsl(240deg 30% 95%) 100%
  );

  .icon-list svg {
    color: var(--color-white);
  }

  @media (min-width: 1000px) {
    .icon-list {
      margin-bottom: 0;
    }
  }

  @media (max-width: 1000px) {
    display: ${({ visibleOn }) => (visibleOn !== "desktop" ? "flex" : "none")};
    grid-column: 1;
  }
`;

const AllPlansInfo = styled.p`
  margin: 2rem auto 4rem;
  max-width: 44rem;
  line-height: 1.5rem;
  text-align: center;
`;

const SelfHost = styled.div`
  border-top: 1px dotted #ccc;
  border-bottom: 1px dotted #ccc;

  text-align: center;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    margin: 1rem 0 0;
  }

  button,
  a {
    margin: 2rem 0 3rem;
    font-size: 0.9rem;
  }
`;

const HR = styled.hr``;

const FAQGrid = styled.div`
  display: grid;
  max-width: 1200px;
  margin: 2rem auto 3rem;

  div {
    cursor: pointer;
    border-bottom: 1px dotted #ccc;

    h4 {
      margin: 0.8rem 0 0.75rem 0;
      font-weight: normal;
      font-family: var(--font);
    }
    p:not(:last-of-type) {
      margin-bottom: 1rem;
    }
    p:last-of-type {
      margin: 0 0 2rem;
    }

    & + div {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    & p {
      display: none;
    }
    &.active p {
      display: block;
    }
  }
`;
