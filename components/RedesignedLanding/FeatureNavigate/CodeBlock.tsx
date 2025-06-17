"use client";

import { Fragment } from "react";
import { Highlight, themes } from "prism-react-renderer";

export default function CodeBlock() {
  const snippetDurableWorkflow = `
export const sendNotifications = inngest.createFunction(
  { id: "send-notifications" }, {/*...*/},
  async ({ event, step }) => {
    const preferences = await step.run("load-prefs", async () => {
      const user = await db.users.find(event.data.userId)
      return user.loadPreferences();
    });

    // Use language-specific idioms like Promise.all to automatically
    // parallelize steps.
    await Promise.all([
      step.run("send-to-slack", async () => {
        await app.client.chat.postMessage({
          channel: preferences.slackChannelId,
          blocks: formatBlocks(event.data.notification),
          // ...
        });
      }),
      step.run("send-via-sms", async () => {
        await client.messages.create(...);
      }),
    ]);
  }
);
`;

  return (
    <Fence
      language="typescript"
      children={snippetDurableWorkflow}
      showLineNumbers
    />
  );
}
export function Fence({
  children,
  language,
  showLineNumbers = false,
}: {
  children: string;
  language: string;
  showLineNumbers?: boolean;
}) {
  return (
    <Highlight
      code={children.trim()}
      language={language}
      theme={themes.gruvboxMaterialDark}
    >
      {({ className, style, tokens, getTokenProps }) => (
        <pre
          className={`bg-stone-800 ${className} flex overflow-x-auto pt-3 text-sm`}
        >
          <code
            aria-hidden
            className="w-10 select-none pr-4 text-right  text-[#ADADAD]"
          >
            {showLineNumbers &&
              tokens.map((_, i) => (
                <span key={i} className="block leading-[1.625]">
                  {(i + 1).toString()}
                </span>
              ))}
          </code>

          <code className="flex-1 leading-[1.625]">
            {tokens.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                {"\n"}
              </Fragment>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
