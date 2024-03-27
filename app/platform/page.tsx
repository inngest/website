import Container from "src/shared/layout/Container";
import Heading from "src/components/Heading";

export default function Page() {
  return (
    <>
      <div className="mt-32">
        <Heading
          title="Your application reliability layer"
          context="Platform"
          lede={
            <>
              Inngest's architecture combines an event stream, queues, and
              durable execution into a single reliability layer for your
              application. From distributed systems to serverless, Inngest is
              designed to help you build the complex with less headaches and in
              far less time.
            </>
          }
          ledeClassName="max-w-[720px]"
        />
        <div className="mt-8 grid grid-cols-3 gap-8">
          <Card title={"Events"} />
          <Card title={"Flow control"} />
          <Card title={"Durable execution"} />
        </div>
      </div>
    </>
  );
}

function Card({ title }: { title?: string }) {
  return (
    <div>
      <div className="rounded-md bg-slate-300 h-300 w-full">ok</div>
      {title && <p className="mt-4 text-body text-lg text-center">{title}</p>}
    </div>
  );
}
