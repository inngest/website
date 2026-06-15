/**
 * Inline mono token in salmon — used for event names (e.g.
 * `user.created`, `inngest.send()`) embedded in body copy.
 */
export default function InlineCode({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <code className="font-v1Mono text-[16px] text-v1-accent-salmon">
      {children}
    </code>
  );
}
