import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import Footer from "../../shared/Footer";
import { Button } from "src/shared/Button";

import { loadMarkdownFilesMetadata, MDXFileMetadata } from "utils/markdown";

export type Role = {
  title: string;
  location: string;
  date: string;
  applicationURL: string;
};
type RoleMetadata = Role & MDXFileMetadata;

export async function getStaticProps({ params }) {
  const roles = await loadMarkdownFilesMetadata<Role>("pages/careers/_roles");
  const visibleRoles = roles.filter((r) => !r.hidden);
  return {
    props: {
      roles: JSON.stringify(visibleRoles),
      meta: {
        title: `Careers at Inngest`,
        description: `We're hiring!`,
      },
      designVersion: "2",
    },
  };
}

export default function Careers(props) {
  const roles: RoleMetadata[] = JSON.parse(props.roles);

  return (
    <>
      <div className="font-sans">
        <Header />
        <Container>
          <article>
            <main className="m-auto max-w-[65ch] pt-16">
              <header className="pt-12 lg:pt-24 max-w-[65ch] m-auto">
                <h1 className="text-white font-medium text-2xl md:text-4xl xl:text-5xl mb-2 md:mb-4 tracking-tighter lg:leading-loose">
                  Careers at Inngest
                </h1>
                <Button href="https://jobs.ashbyhq.com/inngest" arrow="right">
                  See Our Open Positions
                </Button>
              </header>
              <div className="my-20 mx-auto prose prose-img:rounded-lg prose-code:bg-canvasMuted prose-code:tracking-tight text-basis prose-a:text-link prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:transition-all prose-invert">
                <AboutInngest heading={true} />

                <h2 id="how-we-work">How we work</h2>
                <p>
                  We're a small, remote-first team of engineers and designers
                  that cares about the details and agree that simpler is better.
                  Every teammate has a voice in shaping the product. We all
                  dogfood our own product and support{" "}
                  <a href="https://www.inngest.com/discord">
                    our community of developers
                  </a>
                  . Context is shared openly and deliberately so every person
                  can understand, contribute, and challenge ideas. As we're a
                  small team, every teammate is expected to contribute outside
                  of their core domains - e.g. designers can code, engineers
                  should write docs and blog posts.
                </p>
                <p>
                  We believe in a fair and inclusive team culture and hire
                  across the world. We are looking for experienced people who
                  are motivated by solving problems for real people. Learn more
                  about our principles here.
                </p>
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
                <h2>Remote-first</h2>
                <p>
                  We began Inngest as a fully distributed company from day one.
                  Our team is spread across locations from the UK to San
                  Francisco. We embrace remote work, but in this early stage of
                  the company, we require teammates to have overlapping
                  timezones with North America.
                </p>
                {/* FUTURE - Backed by key investors - We'll add this section after we've announced our raise and we'll include names devs will know */}
                {/* <h2>Backed by key investors</h2> */}

                <Benefits />
              </div>
              <Button href="https://jobs.ashbyhq.com/inngest" arrow="right">
                See Our Open Positions
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
        <Footer />
      </div>
    </>
  );
}

export const AboutInngest = ({ heading = false }) => (
  <>
    {heading && <h2 id="about-inngest">About Inngest</h2>}
    <p>
      Inngest is an <a href="https://github.com/inngest/inngest">open source</a>{" "}
      platform that enables developers to build amazing products by ensuring
      serverless functions are reliable, schedulable and event-driven.
    </p>
    <p>
      Two trends have shaped our vision for the Inngest platform: event-driven
      systems are driving some of the world's greatest products and building
      these systems is <em>extremely hard</em>.
    </p>
    <p>
      We believe that event-based systems can be beautifully simple and we're
      building the world's first developer platform that allows people to build
      event-driven products in minutes. Our aim is to give developers the
      superpowers they need to just build. Developers deserve first class local
      tooling and a <em>platform</em> that gives them everything they need to
      deliver, not just the underlying <em>plumbing</em> or infrastructure.
    </p>
    <p>
      We're beginning our product journey focused on the early adopter - the
      person who embraces <em>the developer cloud:</em> modern solutions that
      put developer experience at the forefront of the product. Our initial goal
      is to build the absolute best platform and tooling for devs to build
      anything that runs in the background using events. We're{" "}
      <a href="https://www.inngest.com/blog/vercel-integration">
        partnering with key companies
      </a>{" "}
      to fill a{" "}
      <a href="https://www.inngest.com/blog/completing-the-jamstack">
        key gap in the current ecosystem
      </a>{" "}
      and bring Inngest to the masses. We have very big plans beyond that - if
      you're curious, drop us a note.
    </p>
  </>
);

export const Benefits = () => (
  <>
    <h2 id="benefits">What we offer</h2>
    <ul>
      <li>Competitive salary and equity</li>
      <li>Remote-first - work from anywhere</li>
      <li>Health, dental, and vision insurance (US)</li>
      <li>
        International employment and payroll via{" "}
        <a href="https://www.oysterhr.com/" target="_blank">
          OysterHR
        </a>
      </li>
      <li>M2 Macbook Pro</li>
      <li>4 weeks vacation + local national holidays</li>
      <li>401k (US)</li>
    </ul>
  </>
);
