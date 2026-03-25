# Inngest Website

This is the Inngest marketing website and documentation site built with Next.js. It contains marketing pages, MDX-based documentation, blog posts, changelog entries, and customer case studies.

## Tech Stack

- **Framework**: Next.js 15 (App Router + Pages Router hybrid)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Content**: MDX for blog posts, docs, and changelog
- **Package Manager**: pnpm
  - ALWAYS USE pnpm
  - DO NOT use npm
- **Node Version**: 22.x (required)

## Getting Started

```bash
pnpm install   # Install dependencies
pnpm dev       # Start dev server at http://localhost:3001
pnpm build     # Build for production
pnpm start     # Run production build locally
pnpm prettier  # Format code
pnpm env:pull  # Get environment variables from Vercel
```

## File Structure

| Directory            | Purpose                                           |
| -------------------- | ------------------------------------------------- |
| `/app`               | Next.js App Router pages (newer pages)            |
| `/pages`             | Next.js Pages Router pages (legacy - docs, blog)  |
| `/components`        | Reusable React components                         |
| `/shared`            | Shared components and utilities                   |
| `/content/blog`      | Blog post MDX files                               |
| `/content/changelog` | Changelog entry MDX files                         |
| `/pages/docs`        | Documentation MDX files                           |
| `/public`            | Static assets (images, fonts, etc.)               |
| `/snippets`          | Code examples for docs (see `snippets/CLAUDE.md`) |

### Routing

- **App Router**: Files in `/app` use the folder structure (e.g., `/app/about/page.tsx` -> `/about`)
- **Pages Router**: Files in `/pages` use file-based routing (e.g., `/pages/blog.tsx` -> `/blog`)
- Always create new pages in the App Router (`/app`). The Pages Router is legacy.

## Code Style & Conventions

### TypeScript/React

- Use TypeScript for all new files
- Use functional components
- Prefer named exports over default exports for utilities
- Use proper TypeScript types (avoid `any`)

### Styling

- Use Tailwind CSS utility classes
- Use custom design system colors from `tailwind.config.js`
- Prefer semantic color names: `text-basis`, `text-subtle`, `text-muted`, `bg-canvasBase`, `bg-surfaceBase`, `bg-surfaceSubtle`, `border-subtle`, `border-muted`
- Status colors: `status-running`, `status-completed`, `status-failed`
- Dark mode via `class` strategy - semantic tokens adapt automatically
- Mobile-first responsive approach (`sm:`, `md:`, `lg:`, `xl:`)

### Components

- Check `/components` and `/shared` for existing components before creating new ones
- Extract shared components to `/components`, shared logic to `/shared`
- Follow existing component patterns in the codebase
- Common shared components: `Button` (`shared/Button`), `Container` (`shared/layout/Container`), `CodeWindow` (`shared/CodeWindow`), `SectionProvider` (`shared/Docs/SectionProvider`)

### Images

- Use the Next.js `Image` component (`import Image from "next/image"`)
- Store images in `/public/assets/`
- Reference as `/assets/your-image.png` (omit `/public` prefix)

### Links

- **Always use relative URLs for internal links** (e.g., `/docs/sdk/overview` not `https://www.inngest.com/docs/sdk/overview`)
- Use Ref Tags (e.g., `?ref=blog-introducing-checkpointing`) on internal links for marketing attribution. Ref tags should describe the page the link is on.
- Only use absolute URLs for external links

## Code Snippets

The snippet system provides centralized, validated code examples for documentation.

- Start marker: `// !snippet:start` (or `# !snippet:start` in Python)
- End marker: `// !snippet:end` (or `# !snippet:end` in Python)
- Both markers are optional; files without markers use entire content
- MDX reference: `` `!snippet:path=snippets/path/to/file.ext` `` in code blocks
- Processing: `mdx/rehype.mjs` extracts content at build time

See `snippets/CLAUDE.md` for full snippet documentation including validation commands.

## MDX Content

- Blog posts: `/content/blog/*.mdx` or `*.md`
- Changelog entries: `/content/changelog/*.mdx`
- Documentation: `/pages/docs/**/*.mdx`
- Use frontmatter for metadata (title, date, author, etc.)
- React components can be imported and used in MDX files
- MDX component patterns are in `/shared/Docs/`

### Blog Post Frontmatter

**Required fields:**

- `heading` (string) - Title/headline
- `subtitle` (string) - Description
- `image` (string) - Featured image path (e.g., `/assets/blog/example/featured-image.png`)
- `date` (string) - Publication date in ISO8601 format (e.g., `2024-09-25`)
- `category` (string) - One of: `"product-updates"`, `"company-news"`, or `"engineering"`
- `author` (string | string[]) - Author name(s)

**Optional fields:**

- `showSubtitle` (boolean) - Display subtitle (default: false)
- `imageCredits` (string) - Image attribution
- `dateUpdated` (string) - Last updated date (ISO8601). Add/update this when refreshing content.
- `tags` (string[], optional) - DO NOT USE TAGS.
- `canonical_url` (string) - Canonical URL for cross-posted content
- `primaryCTA` (string) - `"sales"`, `"docs"`, or `"signUp"`. Only use for sales-oriented posts.
- `floatingCTA` (boolean) - Show floating CTA button for sales-oriented posts.
- `focus` (boolean) - Feature as highlighted post on main blog feed. Only use if a post must be highlighted for a longer time.
- `hide` (boolean) - Accessible at URL but hidden from feeds and RSS. Only use for pre-release blog posts.
- `featured` (boolean, optional) - When false, hidden from main feed but available on category pages.

### Changelog Entry Format

Changelog entries use JS exports (not YAML frontmatter):

```mdx
export const title = "Your Feature Name";
export const date = "2025-01-15";

Description of the change in MDX format.
```

## Docs Search

See `shared/Docs/SEARCH.md` for docs search (Algolia) architecture.

## Environment & Deployment

- Deployed on Vercel, auto-builds on push to main
- Use `pnpm env:pull` for environment variables; never commit `.env` files
- Default dev variables in `.env.development`
- Run `pnpm prettier` before committing (Prettier with Tailwind plugin)

## Troubleshooting

- **Port in use**: `PORT=3002 pnpm dev`
- **Dependency issues**: Ensure pnpm is used; check Node 22.x
- **Build errors**: Clear cache with `rm -rf .next`, reinstall with `rm -rf node_modules && pnpm install`
- **Styling issues**: Check Tailwind content paths in `tailwind.config.js`, restart dev server
