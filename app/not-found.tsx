import PageHeader from "src/shared/PageHeader";

export default function NotFound() {
  const title = `404 - Page not found`;
  const lede = `We've triggered an event and a serverless function is forwarding it to the team as you read this.`;
  return <PageHeader title={title} lede={lede} />;
}
