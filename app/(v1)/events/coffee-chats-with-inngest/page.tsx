import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import CoffeeChatsWithInngest from "@/components/v1/pages/CoffeeChatsWithInngest";

export const metadata: Metadata = generateMetadata({
  title: "Coffee Chats with Inngest",
  description:
    "Swing by Stone Street Cafe on Wednesday, July 29, 2026, 8–10 AM EDT. Coffee and a pastry are on us, no agenda beyond talking durable execution.",
});

export default function Page() {
  return <CoffeeChatsWithInngest />;
}
