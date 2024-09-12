import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import Footer from "src/shared/Footer";
import Quote from "src/shared/Home/Quote";
import ContactForm from "src/components/ContactForm";

export async function getStaticProps() {
  return {
    props: {
      meta: {
        title: "Inngest + YC",
      },
      designVersion: "2",
    },
  };
}

export default function Contact() {
  return (
    <div className="font-sans text-slate-200">
      <Header />
      <Container>
        <main className="m-auto max-w-5xl pt-16 pb-8">
          <header className="pt-12 lg:pt-24 max-w-4xl m-auto text-center">
            <h1 className="text-white font-bold text-2xl md:text-4xl xl:text-5xl mb-2 md:mb-6 tracking-tight lg:leading-loose">
              Request the YC Deal
            </h1>
            <p className="text-balance">
              Are you a Y Combinator company or alumni? Let us know here for
              access to the YC deal: The pro plan free for the first year, with
              discounts in year 2.
            </p>
          </header>

          <div className="my-12 grid lg:grid-cols-2 gap-24">
            <ContactForm
              eventName="website/yc-deal.submitted"
              eventVersion="2024-08-13.1"
              gtmEvent="YC Lead Form Submitted"
            />

            <div className="mx-auto max-w-2xl">
              <Quote
                text="The DX and visibility with Inngest is really incredible. We are able to develop functions locally easier and faster that with our previous queue. Also, Inngest's tools give us the visibility to debug issues much quicker than before."
                attribution={{
                  name: "Bu Kinoshita",
                  title: "CTO & Co-founder (YC W23)",
                  logo: "/assets/customers/resend.svg",
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
                {/* We should swap these for YC companies and add their batch */}
                <img
                  className="h-8"
                  src="/assets/customers/soundcloud-logo-white-horizontal.svg"
                  alt="SoundCloud"
                />
                <img
                  className="h-9"
                  src="/assets/customers/conveo-logo-white.svg"
                  alt="Conveo"
                />
                <img
                  className="h-7"
                  src="/assets/customers/gitbook-logo-white.svg"
                  alt="Gitbook"
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
