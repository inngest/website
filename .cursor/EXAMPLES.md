# Code Examples & Patterns

## Creating a New Page (App Router)

```tsx
// app/your-page/page.tsx
export default function YourPage() {
  return (
    <div className="bg-canvasBase min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-basis mb-4 text-3xl font-semibold">
          Your Page Title
        </h1>
        <p className="text-subtle">Your page content goes here.</p>
      </div>
    </div>
  );
}
```

## Creating a New Component

```tsx
// components/YourComponent.tsx
import React from "react";

interface YourComponentProps {
  title: string;
  description?: string;
}

export function YourComponent({ title, description }: YourComponentProps) {
  return (
    <div className="bg-surfaceBase border-subtle rounded-lg border p-6">
      <h2 className="text-basis mb-2 text-xl font-semibold">{title}</h2>
      {description && <p className="text-subtle">{description}</p>}
    </div>
  );
}
```

## Creating a Blog Post

```mdx
---
title: "My Awesome Blog Post"
date: "2024-01-15"
author: "Your Name"
description: "A description of the blog post"
---

# My Awesome Blog Post

This is the content of my blog post. You can use **markdown** here.

## A Section

You can also include React components:

import { CodeWindow } from "shared/CodeWindow";

<CodeWindow>{`console.log("Hello, world!");`}</CodeWindow>
```

## Using Tailwind Design System Colors

```tsx
// Text colors
<p className="text-basis">Main text</p>
<p className="text-subtle">Secondary text</p>
<p className="text-muted">Tertiary text</p>
<p className="text-onContrast">Text on dark backgrounds</p>

// Background colors
<div className="bg-canvasBase">Page background</div>
<div className="bg-surfaceBase">Card background</div>
<div className="bg-surfaceSubtle">Subtle background</div>

// Border colors
<div className="border border-subtle">Subtle border</div>
<div className="border border-muted">Muted border</div>
<div className="border border-contrast">High contrast border</div>

// Status colors
<span className="text-status-running">Running</span>
<span className="text-status-completed">Completed</span>
<span className="text-status-failed">Failed</span>
```

## Responsive Design Pattern

```tsx
// Mobile-first approach
<div className="
  text-sm           // Base: small text
  md:text-base      // Medium screens: base text
  lg:text-lg        // Large screens: large text
  xl:text-xl        // Extra large: extra large text
">
  Responsive text
</div>

// Grid layout
<div className="
  grid
  grid-cols-1       // Mobile: 1 column
  md:grid-cols-2    // Medium: 2 columns
  lg:grid-cols-3    // Large: 3 columns
  gap-4
">
  {/* Grid items */}
</div>
```

## Using Existing Components

```tsx
// Import from shared
import { Button } from "shared/Button";
import { Container } from "shared/layout/Container";
import { Heading } from "components/Heading";

// Use them
<Container>
  <Heading>My Heading</Heading>
  <Button href="/somewhere" variant="primary">
    Click me
  </Button>
</Container>;
```

## TypeScript Patterns

```tsx
// Component props interface
interface MyComponentProps {
  title: string;
  count?: number;
  items: string[];
}

// Function component with props
export function MyComponent({ title, count = 0, items }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Common Layout Pattern

```tsx
import { Header } from "shared/Header";
import { Footer } from "shared/Footer";
import { Container } from "shared/layout/Container";

export default function MyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Container>{/* Your page content */}</Container>
      </main>

      <Footer />
    </div>
  );
}
```

## Dark Mode Support

The project uses class-based dark mode. Colors automatically adapt:

```tsx
// These colors work in both light and dark modes
<div className="bg-surfaceBase text-basis">
  Content that adapts to theme
</div>

// Force a specific color
<div className="bg-white dark:bg-black">
  Manual theme control (rarely needed)
</div>
```

## Adding Images

```tsx
import Image from "next/image";

// Images go in /public/assets/
<Image
  src="/assets/your-image.png"
  alt="Description of image"
  width={800}
  height={600}
/>;
```

## MDX with React Components

```mdx
---
title: "My Post"
---

import { CodeWindow } from "shared/CodeWindow";
import { Button } from "shared/Button";

# My Post

Here's some code:

<CodeWindow>
  {`function example() {
  return "Hello";
}`}
</CodeWindow>

And here's a button:

<Button href="/docs">Read Docs</Button>
```
