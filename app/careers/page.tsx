import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import Footer from "src/shared/Footer";
import { Button } from "src/shared/Button";
// import Roles from "./Roles";
import RolesSync from "./RolesSync";

export const metadata: Metadata = generateMetadata({
  title: "Careers at Inngest",
  description: "We're hiring!",
});

// Cache invalidation in seconds
export const revalidate = 60;

export default async function Careers(props) {
  return (
    <>
      <Container>
        <article>
          <main className="m-auto max-w-[65ch] pt-16">
            <header className="pt-12 lg:pt-24 max-w-[65ch] m-auto">
              <h1 className="text-white font-medium text-2xl md:text-4xl xl:text-5xl mb-2 md:mb-4 tracking-tighter lg:leading-loose">
                Careers at Inngest
              </h1>
              <Button href="https://jobs.ashbyhq.com/inngest" arrow="right">
                See our open positions
              </Button>
            </header>
            <div className="my-20 mx-auto prose prose-img:rounded-lg prose-code:bg-canvasMuted prose-code:tracking-tight text-basis prose-a:text-link prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:transition-all prose-invert">
              <AboutInngest heading={true} />

              <h2 id="how-we-work">How we work</h2>
              <p>
                We're a <a href="/about">small, remote-first team</a> that are
                passionate about delivering great products. We all work closely
                with customers to deliver the right solution that solves many
                use cases, not on-off features.
              </p>
              <p>
                Our work is challenging. We build systems and solutions that
                must reach high throughput, low latency, and rock-solid
                reliability. We're approaching systems design from first
                principles and design with optionality in mind.
              </p>
              <p>
                We dogfood our own product and regularly interact with{" "}
                <a href="https://www.inngest.com/discord">
                  our community of developers
                </a>
                . We know feedback and hands on usage is fundamental to building
                truly great developer tools.
              </p>
              <p>
                We believe in a fair and inclusive team culture and hire across
                the world. We are looking for experienced people who are
                motivated by solving problems for real people.
              </p>
              <p>
                We're backed by world-class investors and builders including
                a16z, Notable capital, Guillermo Rauch, Tom Preston-Werner, and
                more.
              </p>
              {/* Hide for now to reduce length of page
                <h2 id="values">Company values & principles</h2>
                <ul>
                  <li>
                    Pursue an{" "}
                    <strong>
                      <u>accurate understanding of reality</u>
                    </strong>
                    . We learn from mistakes, avoid overconfidence, and
                    continuously improve our observations and hypotheses to
                    drive business and product decisions.
                  </li>
                  <li>
                    Appreciate{" "}
                    <strong>
                      <u>context and nuance</u>
                    </strong>
                    . We put in the effort to share and document concise context
                    across the team to empower individuals to make high-quality,
                    nuanced decisions.
                  </li>
                  <li>
                    Encourage{" "}
                    <strong>
                      <u>curiosity</u>
                    </strong>
                    . We explore, learn, and ask questions in all aspects, but
                    especially in our product and with our users.
                  </li>
                  <li>
                    Seek{" "}
                    <strong>
                      <u>simple</u>
                    </strong>{" "}
                    solutions. We believe that simpler answers, code, and
                    products are often the best and lead to better outcomes.
                  </li>
                  <li>
                    Work with{" "}
                    <strong>
                      <u>intentionality</u>
                    </strong>
                    . We can be the most effective when our actions have a clear
                    focus and purpose.
                  </li>
                  <li>
                    Embrace{" "}
                    <strong>
                      <u>ownership</u>
                    </strong>
                    . We are responsible and accountable to our work, actions,
                    and outcomes and expect the same in others.
                  </li>
                  <li>
                    Assume{" "}
                    <strong>
                      <u>positive intent</u>
                    </strong>
                    . We begin with the understanding the each other is doing
                    the best they can and that they communicate with good
                    intentions.
                  </li>
                  <li>
                    Act with{" "}
                    <strong>
                      <u>fairness</u>
                    </strong>
                    . We pursue equitable, unbiased, and principled outcomes for
                    our team and customers.
                  </li>
                </ul>
                */}
              <h2>Remote-first</h2>
              <p>
                We began Inngest as a fully distributed company from day one.
                Our team is spread across locations from the UK to San
                Francisco. We embrace remote work, but in this early stage of
                the company, we require teammates to have overlapping timezones
                with North America.
              </p>
              {/* FUTURE - Backed by key investors - We'll add this section after we've announced our raise and we'll include names devs will know */}
              {/* <h2>Backed by key investors</h2> */}

              <Benefits />
            </div>
            <h2
              id="positions"
              className="mb-8 scroll-mt-32 text-2xl font-semibold"
            >
              Open positions
            </h2>
            <div className="my-8">
              <RolesSync />
            </div>
            <Button href="https://jobs.ashbyhq.com/inngest" arrow="right">
              See all open positions
            </Button>
            <aside className="max-w-[65ch] m-auto flex flex-col items-start gap-4 leading-relaxed py-5 my-12">
              <p className="text-sm lg:text-base">
                Have any questions about a role?
              </p>
              <Button
                href="mailto:careers@inngest.com"
                variant="secondary"
                arrow="right"
              >
                Email us
              </Button>
            </aside>
          </main>
        </article>
      </Container>
    </>
  );
}

const AboutInngest = ({ heading = false }) => (
  <>
    {heading && <h2 id="about-inngest">About Inngest</h2>}
    <p>
      Inngest is a developer platform that enables developers to build amazing,
      complex, and reliable products without the hassle of building and
      maintaining infrastructure. It combines modern orchestration, advanced
      multi-tenant aware queueing, and built-in observability packaged in an
      easy to learn and use product that any developer can learn.
    </p>
    <p>
      In 2022, we released our SDK, introducing a new way to build event-driven
      workflows all centered around a simple concept of <code>step.run</code>.
      This grew from TypeScript to Python to Golang and expanded to include all
      sorts of features including steps that wait for events, composable
      workflows, and flow control features backed by a custom-designed queue.
    </p>
    <p>
      Inngest is <a href="https://github.com/inngest/inngest">open source</a> at
      it's core to be run on any developer's laptop for local testing and at
      scale on Inngest Cloud. Developers uses our SDKs to easily define
      workflows in their existing codebases and run them on any compute
      platform, from serverless to servers.
    </p>
    <p>
      We're a growing team of engineers, designers, and marketers who care
      deeply about building products with best-in-class DX that developers
      deserve and love to use.
    </p>
  </>
);

const Benefits = () => (
  <>
    <h2 id="benefits">What we offer</h2>
    <ul>
      <li>Competitive salary and equity</li>
      <li>Remote-first - work from anywhere</li>
      <li>Health, dental, and vision insurance (US)</li>
      <li>
        International employment and payroll via{" "}
        <a href="https://www.rippling.com/" target="_blank">
          Rippling
        </a>
      </li>
      <li>Macbook Pro</li>
      <li>4 weeks vacation + local national holidays</li>
      <li>401k (US)</li>
    </ul>
  </>
);
