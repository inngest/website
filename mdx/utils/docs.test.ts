import { describe, it } from 'node:test';
import assert from 'node:assert';
import { convertMdxToMarkdown } from "./mdx-to-markdown";

describe("convertMdxToMarkdown", () => {
  it("should convert Card components to markdown links", async () => {
    const fixtures = [
      {
        input: `<Card href="/docs/getting-started">Getting Started</Card>`,
        expected: `[Getting Started](/docs/getting-started)`,
      },
      {
        input: `<Card title="Your application" icon={<RiCloudLine className="text-basis h-4 w-4" />} href="/docs/events">
  Send an event from your application's backend with the Inngest SDK.
</Card>`,
        expected: `**Your application**: [Send an event from your application's backend with the Inngest SDK.](/docs/events)`,
      },
    ];

    for (const fixture of fixtures) {
      const result = await convertMdxToMarkdown(fixture.input);
      assert.equal(result.trim(), fixture.expected.trim());
    }
  });

  it("should remove import statements", async () => {
    const input = `import { Something } from "somewhere";
import Component from "./component";

# Hello World

Some content here.`;

    const result = await convertMdxToMarkdown(input);
    assert.ok(!result.includes("import"));
    assert.ok(result.includes("# Hello World"));
    assert.ok(result.includes("Some content here."));
  });

  it("should convert Note components to blockquotes", async () => {
    const input = `<Note>This is important information.</Note>`;
    const result = await convertMdxToMarkdown(input);
    assert.ok(result.includes("> **Note:**"));
    assert.ok(result.includes("This is important information."));
  });

  it("should convert Warning components to blockquotes", async () => {
    const input = `<Warning>Be careful!</Warning>`;
    const result = await convertMdxToMarkdown(input);
    assert.ok(result.includes("> **Warning:**"));
    assert.ok(result.includes("Be careful!"));
  });

  it("should convert Step components with titles to headings", async () => {
    const input = `<Step title="First Step">
Do something here.
</Step>`;
    const result = await convertMdxToMarkdown(input);
    assert.ok(result.includes("### First Step"));
    assert.ok(result.includes("Do something here."));
  });

  it("should extract children from container components", async () => {
    const input = `<CardGroup cols={2}>
<Card href="/docs/one">One</Card>
<Card href="/docs/two">Two</Card>
</CardGroup>`;
    const result = await convertMdxToMarkdown(input);
    assert.ok(result.includes("[One](/docs/one)"));
    assert.ok(result.includes("[Two](/docs/two)"));
    assert.ok(!result.includes("CardGroup"));
  });

  it("should convert Property components to list items", async () => {
    const input = `<Property name="userId" type="string">The user's unique identifier.</Property>`;
    const result = await convertMdxToMarkdown(input);
    assert.ok(result.includes("`userId`"));
    assert.ok(result.includes("(string)"));
    assert.ok(result.includes("The user's unique identifier."));
  });

  it("should convert Button components with href to links", async () => {
    const input = `<Button href="/docs/start">Get Started</Button>`;
    const result = await convertMdxToMarkdown(input);
    assert.ok(result.includes("[Get Started](/docs/start)"));
  });

  it("should preserve code blocks", async () => {
    const input = `Here is some code:

\`\`\`typescript
const x = 1;
\`\`\`

More text.`;
    const result = await convertMdxToMarkdown(input);
    assert.ok(result.includes("```typescript"));
    assert.ok(result.includes("const x = 1;"));
    assert.ok(result.includes("```"));
  });

  it("should remove frontmatter", async () => {
    const input = `---
title: My Page
description: A description
---

# Hello`;
    const result = await convertMdxToMarkdown(input);
    assert.ok(!result.includes("---"));
    assert.ok(!result.includes("title: My Page"));
    assert.ok(result.includes("# Hello"));
  });

  it("should handle GuideSection components", async () => {
    const input = `<GuideSection show="ts">
TypeScript specific content here.
</GuideSection>`;
    const result = await convertMdxToMarkdown(input);
    assert.ok(result.includes("#### TypeScript"));
    assert.ok(result.includes("TypeScript specific content here."));
  });

  it("should remove self-closing components", async () => {
    const input = `Some text before.

<YouTube id="abc123" />

Some text after.`;
    const result = await convertMdxToMarkdown(input);
    assert.ok(result.includes("Some text before."));
    assert.ok(result.includes("Some text after."));
    assert.ok(!result.includes("YouTube"));
  });
});
