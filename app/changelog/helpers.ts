export type ChangelogEntry = {
  title: string;
  date: string;
};

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

export function getChangelogURL(slug: string, relative = true) {
  return relative
    ? `/changelog/${slug}`
    : `${process.env.NEXT_PUBLIC_HOST}/changelog/${slug}`;
}
