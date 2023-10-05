import Link from "next/link";
import Image from "next/image";

import Container from "../layout/Container";
import CodeWindow from "../CodeWindow";
import Heading from "./Heading";
import { Button } from "../Button";

const Code = ({ children }) => (
  <code className="font-mono bg-transparent text-indigo-200 px-0">
    {children}
  </code>
);

const content = [
  {
    title: "Automatic retries",
    content: (
      <p>
        Every step of your function is retried whenever it throws an error.
        Customize the number of retries to ensure your functions are reliably
        executed.
      </p>
    ),
    href: "/docs/functions/retries", // TODO - Should probably update this doc
  },
  {
    title: "Durable sleep",
    content: (
      <p>
        Pause your function for hours, days or weeks with{" "}
        <Code>step.sleep()</Code> and <Code>step.sleepUntil()</Code>. Inngest
        manages job state while your function is paused and resumes execution
        automatically exactly when you want it to.
      </p>
    ),
    href: "/docs/reference/functions/step-sleep",
  },
  {
    title: "Replay functions",
    content: (
      <p>
        Forget dead letter queues. Fix your issues then replay a failed function
        in a single click.
      </p>
    ),
    // href: "/docs/reference/functions/step-sleep", // TODO doc on this
  },
  {
    title: "Manage concurrency",
    content: (
      <p>
        Set custom concurrency limits for every function to fine-tune how
        quickly your jobs run. For more control, you can set concurrency limits
        based on keys like <Code>user_id</Code>, which gives you unlimited
        “sub-queues” to ensure no one user backs up or overwhelms your system.
      </p>
    ),
    href: "/docs/reference/functions/step-sleep",
  },
  {
    title: "Rate limit functions",
    content: (
      <p>
        Limit the number of times a function can execute in a given time period.
        You can also use a custom key to set per-user or per-whatever rate
        limits with a single line of code.
      </p>
    ),
    href: "/docs/reference/functions/rate-limit",
  },
  {
    title: "Declarative job cancellation",
    content: (
      <p>
        Functions can be cancelled using events which means you don't need to
        keep track of running jobs to cancel them. Just send an event from your
        system and Inngest will match your job with your incoming event using
        any key that you set. Cancel long-running jobs without the overhead.
      </p>
    ),
    href: "/docs/functions/cancellation",
  },
];

export default function Features() {
  return (
    <Container className="mt-24">
      <Heading
        title="We built it, so you don't have to"
        lede={
          <>
            Building reliable backends is hard. Don't waste weeks building out
            bespoke systems: <br />
            We've built in all the tools that you need to create complex backend
            workflows.
          </>
        }
        className="text-center"
      />
      <div className="mx-auto my-16">
        <div className="mx-auto grid grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map(({ title, content, href }) => (
            <div
              className="px-6 py-6 flex flex-col gap-6 border border-indigo-300/20 rounded-2xl text-sm text-slate-300 tracking-normal font-medium leading-normal"
              style={{
                background: `linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 100%)`,
                boxShadow: `0px 4px 24px rgba(107, 75, 179, 0.15)`,
              }}
            >
              <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
              <div className="flex-grow">{content}</div>
              {href && (
                <Link
                  href={href}
                  className="mt-4 text-slate-200 hover:text-white hover:underline decoration-dotted underline-offset-4 decoration-slate-50/30"
                >
                  Learn more →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
