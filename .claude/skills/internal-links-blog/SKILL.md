---
name: internal-links-blog
description: "Suggests, then implements internal links for new blog posts"
argument-hint: "[filename]"
---

The goal is to add new internal links to new blog posts for SEO.

1. Analyze the local blog post file.
2. Review all other files in the `content/blog` and `pages/docs` directories.
3. Identify 2-3 locations in existing blog posts where a link to the blog post would be relevant.
4. Suggest 2-3 existing blog posts or documentation pages that I should link to from the new documentation page.

Instructions for suggestions:

- Create unique suggestion numbers across all suggestions so it is easy to approve.
- Follow the links rules in [AGENTS.md](../../../AGENTS.md)
- Use existing text in the documentation page when possible. Avoid new text.
- Inline links mid-sentence are ideal using descriptive, context-rich anchor text.
- Additional links in "Next steps" or "Further Reference" sections are also OK if related.
