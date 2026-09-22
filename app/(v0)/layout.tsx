import AnnouncementBanner from "src/components/AnnouncementBanner";
import Header from "src/components/RedesignedLanding/Header/Header";
import Footer from "src/components/RedesignedLanding/Footer";

// Chrome for the legacy (v0) pages grouped under app/(v0).
// Redesigned pages live under app/(v1) and bring their own PageShell
// chrome, so the root layout is intentionally chrome-free.
export default function V0Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBanner />
      <Header />
      <main className="text-basis">{children}</main>
      <Footer />
    </>
  );
}
