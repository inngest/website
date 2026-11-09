import { type Metadata } from "next";
import { generateMetadata as baseMetadata } from "src/utils/social";
import WorkflowCards from "@/components/v1/pages/WorkflowCards";
import {
  cardQuery,
  parseCardInput,
} from "@/components/v1/pages/WorkflowCards/workflow";

/**
 * /12-days/card — the Inngest Card Shop. Generates a shareable card for
 * the 12 Days of Workflows challenge by "running" a function that uses
 * twelve Inngest primitives.
 *
 * A shared link (?name=&kind=&day=&n=) unfurls as that exact card: the
 * social image is /api/workflow-card with the same params.
 *
 * Not indexed: it's a campaign toy, and every query string is a new page.
 */

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const hasCard = Boolean(first(params.name));
  const input = parseCardInput((k) => first(params[k]));
  const title = hasCard
    ? `${input.name}'s 12 Days of Workflows card`
    : "12 Days of Workflows card shop";

  return {
    ...baseMetadata({
      title,
      image: `/api/workflow-card?${cardQuery(input)}&v=1`,
      description:
        "Make a weird holiday card with a workflow that uses twelve Inngest primitives. Share it to show you're in the 12 Days of Workflows.",
    }),
    robots: { index: false, follow: true },
  };
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const initial = first(params.name)
    ? parseCardInput((k) => first(params[k]))
    : null;
  return <WorkflowCards initial={initial} />;
}
