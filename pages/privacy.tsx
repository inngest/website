import LegalPage from "../shared/layout/LegalPage";

export function getStaticProps() {
  return {
    props: {
      designVersion: "2",
      meta: {
        title: "Privacy",
        description: "Inngest's privacy policy",
      },
    },
  };
}

export default function Privacy() {
  return (
    <LegalPage iframeURL="https://www.iubenda.com/privacy-policy/26885259" />
  );
}
