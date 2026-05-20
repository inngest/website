// .md files are imported as raw strings via our raw-md-loader (Turbopack) /
// asset/source (webpack). @types/mdx would otherwise type them as MDX components.
declare module "*.md" {
  const content: string;
  export default content;
}
