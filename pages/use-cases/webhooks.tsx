import getLibrary from "../../utils/library";

export default function Webhooks(props: any) {
  return (
    <div>{JSON.stringify(props)}</div>
  )
}


export async function getStaticProps(context) {
  // This fetches the library via async functionality on the server before rendering,
  // letting us dynamically generate the use cases.
  const library = await getLibrary();

  return {
    props: {
      useCases: library.forCategory("webhooks"),
    },
  }
}
