import { type Metadata } from "next";
import EventDetail from "@/components/v1/pages/EventDetail";

export const metadata: Metadata = {
  title: "Event",
};

export default function Page() {
  return <EventDetail />;
}
