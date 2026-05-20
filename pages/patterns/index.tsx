export async function getServerSideProps({ query }: { query: Record<string, string | string[] | undefined> }) {
  const destination =
    query.view === "agent"
      ? "/patterns/flash-sales-and-bursty-workflows?view=agent"
      : "/patterns/flash-sales-and-bursty-workflows";

  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
};

export default function Patterns() {
  return null;
}
