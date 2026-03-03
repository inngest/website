Prepare the following files for a new blog post. Follow best practices in @AGENTS.md.

First, ensure that the repo is on the `main` branch and has the latest changes pulled from the remote.

Take any file, like a .md or .doc file and create a new markdown file in the `/content/blog` directory.

- Slugify the title for the filename. Only use lower-case characters and hyphens. DO NOT use dates, special characters, or spaces.
- Write the frontmatter metadata using the @AGENTS.md as a guide.
- Ensure all internal links are relative to the domain, not including `http://www.inngest.com`.
- Use Ref Tags (e.g., `?ref=blog-introducing-checkpointing`) on internal links for marketing attribution. The ref tag should be in the format of `blog-<slugified-title>`.

For all media do the following:

- Copy any included media assets into a new directory replacing the slugified title: `/public/assets/blog/<slugified-title>`.
- Update all media URLs within the blog post to point to the correct location in the new asset directory.

If assets are copied from a directory, remove those files after they are successfully copied.

Create a new branch in the format `blog/<slugified-title>` and stage only the new files.
