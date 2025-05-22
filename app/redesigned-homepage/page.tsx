import { type Metadata } from "next";
import Footer, { Footer2 } from "src/components/RedesignedLanding/Footer";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nosnippet: true,
  },
};

export default async function Page() {
  return (
    <div>
      <Footer />
    </div>
  );
}
