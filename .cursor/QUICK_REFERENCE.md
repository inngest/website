# Quick Reference Guide

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
# http://localhost:3001
```

## 📁 Where Things Go

| What you want to do      | Where to put it                                                    |
| ------------------------ | ------------------------------------------------------------------ |
| Add a blog post          | `/content/blog/your-post.mdx`                                      |
| Add a changelog entry    | `/content/changelog/your-entry.mdx`                                |
| Add a new page           | `/app/your-page/page.tsx` (new) or `/pages/your-page.tsx` (legacy) |
| Add a reusable component | `/components/YourComponent.tsx`                                    |
| Add an image             | `/public/assets/your-image.png`                                    |
| Add documentation        | `/pages/docs/your-topic.mdx`                                       |

## 🎨 Common Styling Patterns

```tsx
// Text colors
className = "text-basis"; // Main text
className = "text-subtle"; // Secondary text
className = "text-muted"; // Tertiary text

// Background colors
className = "bg-canvasBase"; // Page background
className = "bg-surfaceBase"; // Card/container background
className = "bg-surfaceSubtle"; // Subtle background

// Spacing
className = "p-4"; // Padding
className = "m-4"; // Margin
className = "gap-4"; // Gap (for flex/grid)

// Responsive
className = "text-sm md:text-base lg:text-lg";
```

## 📝 MDX Frontmatter Examples

### Blog Post

```mdx
---
title: "Your Blog Post Title"
date: "2024-01-15"
author: "Your Name"
description: "A brief description"
---
```

### Changelog Entry

```mdx
---
title: "New Feature"
date: "2024-01-15"
type: "added"
---
```

## 🔧 Common Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Run production build
pnpm prettier         # Format code
pnpm env:pull         # Get environment variables
```

## 🐛 Troubleshooting

**Port already in use?**

- Change port: `PORT=3002 pnpm dev`

**Dependencies not installing?**

- Make sure you're using pnpm: `pnpm install`
- Check Node version: `node --version` (should be 22.x)

**Build errors?**

- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

**Styling not working?**

- Make sure Tailwind classes are in the content paths (check `tailwind.config.js`)
- Restart the dev server

## 💡 Tips

1. **Use existing components** - Check `/components` and `/shared` before creating new ones
2. **Follow naming conventions** - Use PascalCase for components, kebab-case for files
3. **Test locally** - Always run `pnpm dev` to see your changes
4. **Check the browser console** - Errors will show up there
5. **Use TypeScript** - The project uses TypeScript, so add proper types

## 📚 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MDX Docs](https://mdxjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
