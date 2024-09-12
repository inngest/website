import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import Footer from "src/shared/Footer";
import Quote from "src/shared/Home/Quote";
import ContactForm from "src/components/ContactForm";

export async function getStaticProps() {
  return {
    props: {
      meta: {
        title: "Chat with solutions engineering",
      },
      designVersion: "2",
    },
  };
}

export default function Contact() {
  return (
    <div className="font-sans text-basis">
      <Header />
      <Container>
        <main className="m-auto max-w-5xl pt-16 pb-8">
          <header className="pt-12 lg:pt-24 max-w-4xl m-auto text-center">
            <h1 className="text-white font-bold text-2xl md:text-4xl xl:text-5xl mb-2 md:mb-6 tracking-tight lg:leading-loose">
              Chat with sales engineering
            </h1>
            <p className="text-balance">
              We'll help you evaluate Inngest and show you how Inngest enables
              teams to ship more reliable code, faster.
            </p>

            <div className="flex place-content-center">
              <p className="mt-4 py-4 px-6 rounded-full bg-white/10 flex gap-2 items-center">
                👋&nbsp;&nbsp; Looking for support?{" "}
                <a href="/discord" className="font-medium hover:underline">
                  Chat on Discord
                </a>{" "}
                or{" "}
                <a
                  href={process.env.NEXT_PUBLIC_SUPPORT_URL}
                  className="font-medium hover:underline"
                >
                  create a support ticket
                </a>{" "}
              </p>
            </div>
          </header>

          <div className="my-12 grid lg:grid-cols-2 gap-24">
            <ContactForm
              eventName="contact.form.sent"
              eventVersion="2023-07-12.1"
              gtmEvent="Sales Lead Form Submitted"
            />

            <div className="mx-auto max-w-2xl">
              <Quote
                text="We were struggling with the complexities of managing our social media and e-commerce workflows. Thanks to Inngest, we were able to simplify our development process, speed up our time to market, and deliver a better customer experience. Inngest has become an essential tool in our tech stack."
                attribution={{
                  name: "Aivaras Tumas",
                  title: "CEO @ Ocoya",
                  avatar: "/assets/customers/ocoya-aivaras-tumas.png",
                }}
                variant="vertical"
                className="p-0 md:p-0 pb-4"
              />
              <div className="flex flex-row gap-4 items-center my-8 text-lg text-indigo-50/80">
                <img
                  src="/assets/compliance/soc2.webp"
                  alt="SOC 2"
                  className="h-16 w-16"
                />
                <p>Inngest is SOC 2 Type II compliant.</p>
              </div>
              <p className="mt-8 mb-6 text-lg font-semibold text-indigo-50/80">
                Trusted by
              </p>
              <div className="flex flex-row flex-wrap gap-8">
                <img
                  className="h-8"
                  src="/assets/customers/soundcloud-logo-white-horizontal.svg"
                  alt="SoundCloud"
                />
                <img
                  className="h-7"
                  src="/assets/customers/tripadvisor.svg"
                  alt="TripAdvisor"
                />
                <img
                  className="h-7"
                  src="/assets/customers/resend.svg"
                  alt="Resend"
                />
              </div>
            </div>
          </div>
        </main>
      </Container>
      <Footer />
    </div>
  );
}
