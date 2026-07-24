import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import AIEngineerWorldsFair from "@/components/v1/pages/AIEngineerWorldsFair";

export const metadata: Metadata = generateMetadata({
  title: "Meet Inngest at AI Engineer World's Fair 2026",
  description:
    "Inngest is agent infrastructure that lives in your codebase. Find us at booth #U-G26 at Moscone West, June 29 – July 2, 2026. Book time with the team.",
});

export default function Page() {
  return <AIEngineerWorldsFair />;
}
