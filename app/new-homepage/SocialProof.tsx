import Container from "./Container";
import Image from "next/image";
import Heading from "./Heading";

function AtInngest() {
  return <span className="text-matcha-400">@inngest</span>;
}

const quotes = [
  {
    // https://x.com/erikmunson/status/1790824618208690363
    quote: (
      <>
        I've worked on workflow systems before and am consistently amazed with
        the <AtInngest /> team's ability to do them better than anyone else. it
        takes me a few lines of app code to do things that would've been huge
        projects for an entire team in past jobs, largely due to work like this
      </>
    ),
    name: "Erik Munson",
    username: "erikmunson",
    avatar: "/assets/customers/social-proof/erikmunson.jpg",
  },
  {
    // https://x.com/KINGiTAJ/status/1816494654889578609
    quote: (
      <>
        Today @listedBApp says goodbye to Kafka and I couldn't be more excited
        to be replacing it with <AtInngest />. Not every day do you get to
        replace a major infra component that improves DX, saves money and
        enables faster innovation :rocket:
      </>
    ),
    name: "Taj English",
    username: "KINGiTAJ",
    avatar: "/assets/customers/social-proof/listed-b-taj-english.jpg",
  },
  {
    // https://twitter.com/dzhng/status/1672022811890831362
    quote: (
      <>
        For anyone who is building multi-step AI agents (e.g AutoGPT type
        systems), I highly recommend building it on top of a job queue
        orchestration framework like <AtInngest />, the traceability these
        things provide out of the box is super useful, plus you get timeouts &
        retries for free.
      </>
    ),
    name: "David",
    username: "dzhng",
    avatar: "/assets/customers/social-proof/david-dzhng.jpg",
  },
  {
    // https://x.com/jessethomson11/status/1791539466969981296
    quote: (
      <>
        I think the game has changed with <AtInngest />.
        <br />
        <br />
        To me, it is the missing piece for making a JS/TS a serious backend
        contender.
        <br />
        <br />
        It has queuing, rate limits, backoff, & everything else you named,
        without needing to muck around with SQS. 10/10 recommend
      </>
    ),
    name: "Jesse Thomson",
    username: "jessethomson11",
    avatar: "/assets/customers/social-proof/jessethomson11.jpg",
  },
  {
    // https://twitter.com/patrick_gvr/status/1699396090825437235?s=20
    quote: (
      <>
        Headache prevented by <AtInngest /> and their concurrency feature 🤯
        <br />
        <br />
        This function potentially runs for a long time and this allows us to not
        run this function again when the previous function hasn't finished based
        on the combination specified in 'key'.
        <Image
          src="/assets/customers/social-proof/productlane-image.jpg"
          width="400"
          height="124"
          alt="Image of Inngest function"
          className="mt-2 rounded-sm"
        />
      </>
    ),
    name: "Patrick Göler von Ravensburg",
    username: "patrick_gvr",
    avatar: "/assets/customers/social-proof/productlane-patrick.jpg",
  },
  {
    // https://x.com/nafetswirth/status/1788657563363414431
    quote: (
      <>
        Started playing around with <AtInngest /> for scheduled tasks and
        background jobs.
        <br />
        <br />
        Highly recommended, super simple to set up and amazing DX.
        <br />
        <br />
        Support also very responsive.
        <br />
        <br />
        Great job guys!
      </>
    ),
    name: "Stefan Wirth",
    username: "NafetsWirth",
    avatar: "/assets/customers/social-proof/nafetswirth.jpg",
  },
  {
    // https://x.com/rauchg/status/1752507513818468692
    quote: (
      <>
        So excited to see <AtInngest /> grow. It's the perfect tool to help
        orchestrate complex AI workloads.
        <br />
        <br />
        Behind every successful generative AI product, there are queues and
        pipelines, increasingly powered by Inngest.
      </>
    ),
    name: "Guillermo Rauch",
    username: "rauchg",
    avatar: "/assets/customers/social-proof/rauchg.jpg",
  },
  {
    // https://x.com/jamesqquick/status/1812997159534436506
    quote: (
      <>
        Tried <AtInngest /> for the first time today and …WOW! I'm really
        excited to fit this into some of my app ideas!
      </>
    ),
    name: "James Q Quick",
    username: "jamesqquick",
    avatar: "/assets/customers/social-proof/jamesqquick.jpg",
  },
  {
    // Source: email
    quote: (
      <>
        I love this product so much! I spent 2 days setting up some background
        workers on Render.com and it was a total pain in the ass. I gave up and
        I got my background jobs set up in under 10 minutes with Inngest.
      </>
    ),
    name: "Ray Amjad",
    username: "theramjad",
    avatar: "/assets/customers/social-proof/rayamjad.jpg",
  },
  {
    // https://twitter.com/michealjroberts/status/1701162785529290989?s=20
    quote: (
      <>
        Yeh so <AtInngest /> is perhaps one of the best SaaS platforms I have
        EVER used, incredible stability and crystal clear APIs. Love it already!
      </>
    ),
    name: "Michael Roberts",
    username: "codewithbhargav",
    avatar: "/assets/customers/social-proof/michaeljroberts.jpg",
  },
  {
    // https://twitter.com/codewithbhargav/status/1688079437911511042
    quote: (
      <>
        <AtInngest /> feels like a cheat code. Beautifully done!
      </>
    ),
    name: "Bhargav",
    username: "codewithbhargav",
    avatar: "/assets/customers/social-proof/codewithbhargav.jpg",
  },
  {
    // https://twitter.com/igarcido/status/1679168174678323201
    quote: (
      <>
        The trickiest part was handling large background jobs in a serverless
        infrastructure. <AtInngest /> was key to allow us synchronize all your
        bank transactions to Notion seamlessly.
      </>
    ),
    name: "Ivan Garcia",
    username: "igarcido",
    avatar: "/assets/customers/social-proof/ivangarcia.jpg",
  },
  // {
  //   // https://twitter.com/RiqwanMThamir/status/1686488475162288129
  //   quote: (
  //     <>
  //       Just came across <AtInngest />. This looks bloody gorgeous! Can't wait
  //       to find an idea to plug this in.
  //       <br />
  //       <br />
  //       This is something I wish I had when I was running workflows with
  //       @awscloud lambdas and SQS.
  //     </>
  //   ),
  //   name: "Riqwan",
  //   username: "RiqwanMThamir",
  //   avatar: "/assets/customers/social-proof/riqwanmthamir.jpg",
  // },
  {
    // https://twitter.com/julianbenegas8/status/1657586515436773376
    quote: (
      <>
        ok, <AtInngest /> is incredible... really clear messaging, great docs,
        fast and well designed dashboard, great DX, etc... highly recommend.
      </>
    ),
    name: "JB",
    username: "julianbenegas8",
    avatar: "/assets/customers/social-proof/julianbenegas8.jpg",
  },
  {
    // https://twitter.com/dparksdev/status/1698192136691433780
    quote: (
      <>
        As someone who used to Promise.all and pray I am happy tools like{" "}
        <AtInngest /> exist.
      </>
    ),
    name: "David parks",
    username: "dparksdev",
    avatar: "/assets/customers/social-proof/dparksdev.jpg",
  },
];

export default function SocialProof({ className }: { className?: string }) {
  return (
    <Container className={`my-44 relative z-30 ${className}`}>
      <Heading
        label="Developer love"
        title="What devs are saying about Inngest"
        description={
          <>
            Don't just take our word for it, this is what developers think about
            Inngest.
          </>
        }
      />
      <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quotes.map(({ name, username, quote, avatar }) => (
          <div className="p-6 max-w-[420px] mx-auto flex flex-col gap-4 rounded-md bg-canvasBase text-basis shadow-[0_0_220px_16px_rgba(20,284,286,0.2)]">
            <div className="flex flex-row gap-4 w-full items-center font-medium">
              <Image
                src={avatar}
                alt={`Image of ${name}`}
                height={36}
                width={36}
                className="rounded-full"
              />
              <span className="grow text-sm">
                {name}
                {!!username && (
                  <span className="ml-2 text-muted">@{username}</span>
                )}
              </span>
            </div>
            <p className="text-sm md:text-base">{quote}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
