import { CheckIcon } from "@heroicons/react/20/solid";
import { CheckCircle } from "react-feather";
import Header from "src/shared/Header";
import Check from "src/shared/Icons/Check";
import PageHeader from "src/shared/PageHeader";
import Container from "src/shared/layout/Container";
import PageContainer from "src/shared/layout/PageContainer";

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      designVersion: "2",
    },
  };
};

export default function workflowEngine() {
  return (
    <PageContainer>
      <Header />

      <Container>
        <div className="py-24 md:py-48 gap-2 justify-between lg:items-center">
          <div className="grid grid-cols-2">
            <div>
              <h1 className="
                text-4xl font-semibold leading-[48px]
                sm:text-5xl sm:leading-[58px]
                lg:text-6xl lg:leading-[68px]
                tracking-[-2px] text-slate-50 mb-8
              ">
                Launch customizable workflows, in&nbsp;weeks
            </h1>

            <p className="text-lg text-slate-200 max-w-xl leading-8">
              Build powerful customizable workflows directly in your product using Inngest as the reliable
              orchestration engine.  Develop locally and ship to your existing production systems ready for
              any scale.
            </p>

            <ul className="text-lg my-8 leading-8 font-medium">
              <li className="flex items-center">
                <Check size={20} className="mr-2" /> Integrate directly into your existing code
              </li>
              <li className="flex items-center">
                <Check size={20} className="mr-2" /> Powerful, customizable, and observable
              </li>
              <li className="flex items-center">
                <Check size={20} className="mr-2" /> Operate at scale
              </li>
            </ul>
            </div>
          </div>

          <div>
            {/*<!-- TODO: Hero image -->*/}
          </div>
        </div>
      </Container>

      <Container>
        <div className="grid grid-cols-2">
          <div>
            {/*<!-- TODO: Case study image -->*/}
          </div>

          <div>
          <span className="text-2xs uppercase tracking-[.25em]">Case study</span>
            <h2 className="text-3xl font-semibold my-4">
              FlorianWorks: zero to building a mission-critical workflow engine for fire departments
            </h2>
            <p className="mb-3">
              FlorianWorks develops custom-built software products for fire departments, incorporating custom
              workflows built directly on top of Inngest to ship reliable products faster and easier.
            </p>
            <p>
              Utilizing Inngest's core workflow engine and primitives such as <code className="text-sm">step.waitForEvent</code>,
              FlorianWorks ships scheduling, roster management, a rules engine, and finance management without spending effort
              developing custom distributed systems primitives or reliability concerns.
            </p>
            <ul className="my-3 leading-8">
              <li className="flex items-center">
                <Check size={14} className="mr-2" /> Development on core business logic only
              </li>
              <li className="flex items-center">
                <Check size={14} className="mr-2" /> Auditable, logged, secure workflows
              </li>
              <li className="flex items-center">
                <Check size={14} className="mr-2" /> Zero additional infrastructure required
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <Container className="mt-48 mb-24">
        <div className="w-1/2 m-auto text-center">
          <h2 className="text-3xl font-semibold my-4">
            Fully customizable, durable workflows
          </h2>
          <p>
            You bring the application code, we bring the engine.  Allow your own users to
            create workflows composed of reusable logic that you define.  Our engine
            runs workflows as steps, taking care of scale, orchestration, idempotency, retries,
            and observability for you.
          </p>
        </div>
      </Container>

    </PageContainer>
  );
}
