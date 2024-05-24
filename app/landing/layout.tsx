export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark">
      {/* Temp add "dark" class above until we support dark/light mode throughout the site */}
      <main className="prose dark:prose-invert">{children}</main>
    </div>
  );
}
