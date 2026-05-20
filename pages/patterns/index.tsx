import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
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
