import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import Footer from "src/shared/Footer";

export default function LegalPage({ iframeURL }: { iframeURL: string }) {
  return (
    <div className="font-sans">
      <Header />
      <Container>
        <iframe className="w-full h-screen" src={iframeURL} />
      </Container>
      <div className="mt-48">
        <Footer />
      </div>
    </div>
  );
}
