import getLibrary, { LibraryData } from "../../utils/library";
import Header from "./_header";
import UseCases from "./_useCases";

const CATEGORY="webhooks"

export default function Webhooks(props: { useCases: LibraryData }) {
  return (
    <div>
      <Header
        category={CATEGORY}
        header="Manage webhooks in minutes, with&nbsp;zero&nbsp;infra"
        subheader="Using Inngest, you can create a production-ready environment to receive webhooks and trigger serverless functions automatically — zero downtime, zero configuration, zero infra."
      />

      <UseCases items={props.useCases} category={CATEGORY} />
    </div>
  );
}

export async function getStaticProps(_context: any) {
  // This fetches the library via async functionality on the server before rendering,
  // letting us dynamically generate the use cases.
  const library = await getLibrary();

  return {
    props: {
      useCases: library.forCategory(CATEGORY),
    },
  };
}
