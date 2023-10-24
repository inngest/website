import Link from "next/link";
import Image from "next/image";

import Container from "../layout/Container";
import CodeWindow from "../CodeWindow";
import Heading from "./Heading";
import { Button } from "../Button";

const content = [
  {
    title: "Durable workflows",
    content: (
      <p>
        Combine any complex series of tasks into a single reliable workflow.
        Each task becomes a “step” which is automatically retried when errors
        happen.
      </p>
    ),
    bullets: [
      <>Run steps in parallel or series or call a child workflow.</>,
      <>
        Add durable sleep to pause your workflow for days or weeks at a time.
      </>,
      <>
        Visually debug the entire workflow without having to parse logs and
        connect the dots.
      </>,
    ],
    href: "/uses/serverless-queues", // TODO
  },
  {
    title: "AI + LLMs",
    content: (
      <p>
        Chain calls to LLMs or any AI API reliably without worrying about glue
        code.
      </p>
    ),
    bullets: [
      <>Handle complex text-generation with chain-based post-processing.</>,
      <>Wrap steps to run exactly once to reduce extra, expensive API calls.</>,
      <>
        Load data from databases and vector stores without complex interfaces or
        adapters.
      </>,
    ],
    href: "/ai",
  },
  {
    title: "Background jobs",
    content: (
      <p>Write declarative background jobs without queues or infrastructure.</p>
    ),
    bullets: [
      <>Run your code in serverless, servers, or on the edge.</>,
      <>Fan-out work to multiple functions from a single event trigger.</>,
      <>Logs and observability metrics out-of-the-box.</>,
    ],
    href: "/uses/serverless-node-background-jobs",
  },
  {
    title: "Customizable workflow engines",
    content: (
      <p>
        Create a user-customizable workflow engine right in your product without
        having to build the engine itself.
      </p>
    ),
    bullets: [
      <>Build linear or complex DAG-workflows with our SDK's primitives.</>,
      <>
        Handle concurrency, prioritization and debounce in line with your user's
        limits.
      </>,
      <>
        Easily audit, observe and scale your product without breaking a sweat.
      </>,
    ],
    href: "/uses/workflow-engine",
  },
];

export default function UseCases() {
  return (
    <Container className="mt-12">
      <Heading
        title="Ship the impossible. Today."
        lede={
          <>
            Using simple primitives you can build the most complex systems
            without the stress.
          </>
        }
        className="text-center"
      />
      <div className="max-w-[980px] mx-auto my-16 bg-[url(/assets/homepage/use-case-background.svg)] bg-contain">
        <div className="mx-auto grid md:grid-cols-2 gap-8">
          {content.map(({ title, content, bullets, href }) => (
            <div
              className="px-9 py-8 flex flex-col gap-6 border border-indigo-300/20 rounded-3xl text-sm text-slate-300 backdrop-blur-sm"
              style={{
                background: `radial-gradient(70% 80% at center 0%, rgba(255,255,255,0.06) 3%, rgba(98, 255, 179, 0) 70%, rgba(98, 255, 179, 0) 100%)`,
                // background: `radial-gradient(114.31% 100% at 50% 0%, #131E38 0%, #0A1223 100%)`,
                boxShadow: `0px 4px 24px rgba(107, 75, 179, 0.20)`,
              }}
            >
              <h3 className="text-xl font-semibold text-slate-50">{title}</h3>
              {content}
              <ul className="list-disc ml-8 flex flex-col grow gap-2">
                {bullets.map((b) => (
                  <li>{b}</li>
                ))}
              </ul>
              <Link
                href={href}
                className="mt-4 text-indigo-300 hover:text-white hover:underline decoration-dotted underline-offset-4 decoration-slate-50/30"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* TODO - List all use cases with links */}
    </Container>
  );
}
