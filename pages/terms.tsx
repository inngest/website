import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import Footer from "components/RedesignedLanding/Footer";

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
        <iframe
          src="https://www.iubenda.com/terms-and-conditions/26885259"
          className="my-12 min-h-[1200px] w-full border-0"
        />
      </Container>

      <Footer />
    </>
  );
}
