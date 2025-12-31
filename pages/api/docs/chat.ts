import type { NextApiRequest, NextApiResponse } from "next";
import fs from "node:fs";
import path from "node:path";

// Chat provider configurations
const CHAT_PROVIDERS = {
  chatgpt: {
    name: "ChatGPT",
    baseUrl: "https://chat.openai.com/",
    supportsQueryPrefill: false,
  },
  claude: {
    name: "Claude",
    baseUrl: "https://claude.ai/new",
    supportsQueryPrefill: false,
  },
  perplexity: {
    name: "Perplexity",
    baseUrl: "https://www.perplexity.ai/",
    queryParam: "q",
    supportsQueryPrefill: true,
  },
  t3chat: {
    name: "T3 Chat",
    baseUrl: "https://t3.chat/",
    supportsQueryPrefill: false,
  },
} as const;

type ChatProvider = keyof typeof CHAT_PROVIDERS;

function getMarkdownContent(docPath: string): string | null {
  const sanitizedPath = docPath
    .replace(/^\/docs\/?/, "")
    .replace(/\.\./g, "")
    .replace(/^\/+/, "");

  const possiblePaths = [
    path.join(process.cwd(), "pages", "docs", `${sanitizedPath}.mdx`),
    path.join(process.cwd(), "pages", "docs", `${sanitizedPath}/index.mdx`),
    path.join(process.cwd(), "pages", "docs", `${sanitizedPath}.md`),
  ];

  for (const p of possiblePaths) {
    // Security check: ensure path is within docs directory
    const resolvedPath = path.resolve(p);
    const docsDir = path.resolve(process.cwd(), "pages", "docs");
    if (!resolvedPath.startsWith(docsDir)) {
      continue;
    }

    if (fs.existsSync(p)) {
      return fs.readFileSync(p, "utf-8");
    }
  }

  return null;
}

function createPrompt(markdown: string, pageUrl: string, customPrompt?: string): string {
  if (customPrompt) {
    return customPrompt.replace("{markdown}", markdown).replace("{pageUrl}", pageUrl);
  }

  return `I'm reading the Inngest documentation page: ${pageUrl}

Here's the content:

${markdown}

---

Please help me understand this documentation.`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGet(req, res);
  } else if (req.method === "POST") {
    return handlePost(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { path: docPath, provider = "chatgpt", action = "redirect" } = req.query;

  if (!docPath || typeof docPath !== "string") {
    return res.status(400).json({ error: "Missing 'path' query parameter" });
  }

  const providerKey = (typeof provider === "string" ? provider : provider[0]) as ChatProvider;
  const providerConfig = CHAT_PROVIDERS[providerKey];

  if (!providerConfig) {
    return res.status(400).json({
      error: "Invalid provider",
      validProviders: Object.keys(CHAT_PROVIDERS),
    });
  }

  const markdown = getMarkdownContent(docPath);
  if (!markdown) {
    return res.status(404).json({ error: "Document not found", path: docPath });
  }

  const pageUrl = `${process.env.NEXT_PUBLIC_HOST || "https://www.inngest.com"}${docPath}`;
  const prompt = createPrompt(markdown, pageUrl);

  let redirectUrl: string = providerConfig.baseUrl;

  // If the provider supports query prefill, add the content
  if (providerConfig.supportsQueryPrefill && "queryParam" in providerConfig) {
    const encodedPrompt = encodeURIComponent(prompt);
    // Limit URL length to avoid issues (most browsers support ~2000 chars)
    const maxLength = 1800;
    const truncatedPrompt =
      encodedPrompt.length > maxLength
        ? encodeURIComponent(prompt.slice(0, maxLength) + "...[truncated]")
        : encodedPrompt;
    redirectUrl = `${providerConfig.baseUrl}?${providerConfig.queryParam}=${truncatedPrompt}`;
  }

  // Return URL as JSON or redirect based on action
  if (action === "url") {
    return res.status(200).json({
      url: redirectUrl,
      provider: providerConfig.name,
      supportsQueryPrefill: providerConfig.supportsQueryPrefill,
      markdown: markdown,
      prompt: prompt,
    });
  }

  // Default: redirect to the chat provider
  return res.redirect(302, redirectUrl);
}

function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { path: docPath, provider = "chatgpt", customPrompt } = req.body;

    if (!docPath) {
      return res.status(400).json({ error: "Missing 'path' in request body" });
    }

    const providerConfig = CHAT_PROVIDERS[provider as ChatProvider];
    if (!providerConfig) {
      return res.status(400).json({
        error: "Invalid provider",
        validProviders: Object.keys(CHAT_PROVIDERS),
      });
    }

    const markdown = getMarkdownContent(docPath);
    if (!markdown) {
      return res.status(404).json({ error: "Document not found", path: docPath });
    }

    const pageUrl = `${process.env.NEXT_PUBLIC_HOST || "https://www.inngest.com"}${docPath}`;
    const prompt = createPrompt(markdown, pageUrl, customPrompt);

    return res.status(200).json({
      provider: providerConfig.name,
      baseUrl: providerConfig.baseUrl,
      supportsQueryPrefill: providerConfig.supportsQueryPrefill,
      markdown: markdown,
      prompt: prompt,
    });
  } catch (error) {
    return res.status(400).json({ error: "Invalid request body" });
  }
}

