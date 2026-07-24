import PageShell from "@/components/v1/PageShell";
import EventDetailHero from "@/components/v1/sections/Events/EventDetailHero";
import GuestSpeakers from "@/components/v1/sections/Events/GuestSpeakers";
import OtherUpcomingEvents from "@/components/v1/sections/Events/OtherUpcomingEvents";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";

export default function EventDetail() {
  return (
    <PageShell>
      <EventDetailHero />
      <GuestSpeakers />
      <OtherUpcomingEvents />
      <LogoMarquee />
    </PageShell>
  );
}
