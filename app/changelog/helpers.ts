export async function loadPost(slug: string) {
  const { default: Post, getStaticProps } = await import(
    `content/changelog/${slug}.mdx`
  );
  const metadata = getStaticProps().props;
  if (!metadata.date) {
    const filenameDate = slug.match(/\d\d\d\d-\d\d-\d\d/)?.[0];
    if (filenameDate) {
      metadata.date = filenameDate;
    }
  }
  return {
    Post,
    metadata,
  };
}
