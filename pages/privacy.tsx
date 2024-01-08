import React from "react";
import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import Footer from "src/shared/Footer";

export async function getStaticProps() {
  return {
    props: {
      meta: {
        title: "Privacy",
        description: "Inngest's privacy policy",
      },
    },
  };
}

export default function Privacy() {
  return (
    <>
      <Header />

      <Container>
        <div className="max-w-[1200px] mx-auto">
          <iframe
            src="https://www.iubenda.com/privacy-policy/26885259"
            className="border-0 w-full min-h-[1200px] my-[50px]"
          />
        </div>
      </Container>

      <Footer />
    </>
  );
}
