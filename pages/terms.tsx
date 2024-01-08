import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import Footer from "src/shared/Footer";

export async function getStaticProps() {
  return {
    props: {
      meta: {
        title: "Terms",
        description: "Inngest's terms and conditions",
      },
    },
  };
}

export default function Terms() {
  return (
    <>
      <Header />

      <Container>
        <div className="max-w-[1200px] mx-auto">
          <iframe
            src="https://www.iubenda.com/terms-and-conditions/26885259"
            className="border-0 w-full min-h-[1200px] my-[50px]"
          />
        </div>
      </Container>

      <Footer />
    </>
  );
}
