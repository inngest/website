import { type Metadata } from "next";
import { generateMetadata } from "src/utils/social";
import InnhouseSFCoffeeChats from "@/components/v1/pages/InnhouseSFCoffeeChats";

export const metadata: Metadata = generateMetadata({
  title: "Innhouse with Inngest: Coffee Chats & Pastries",
  description:
    "Swing by the Inngest office in San Francisco on Wednesday, August 26, 2026, 9AM-12PM PDT for pastries, espresso, and good conversation. Drop in anytime.",
});

export default function Page() {
  return <InnhouseSFCoffeeChats />;
}
