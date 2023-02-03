import LegalPage from "../shared/layout/LegalPage";

export function getStaticProps() {
  return {
    props: {
      designVersion: "2",
      meta: {
        title: "Cookie Policy",
        description: "Inngest's Cookie Policy",
      },
    },
  };
}

export default function Terms() {
  return (
    <LegalPage iframeURL="https://www.iubenda.com/privacy-policy/26885259/cookie-policy" />
  );
}
