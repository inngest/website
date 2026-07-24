import PageShell from "@/components/v1/PageShell";
import AllEvents from "@/components/v1/sections/Events/AllEvents";
import Backdrop from "@/components/v1/sections/Events/Backdrop";
import Hero from "@/components/v1/sections/Events/Hero";
import UpcomingEvents from "@/components/v1/sections/Events/UpcomingEvents";
import LogoMarquee from "@/components/v1/sections/Home/LogoMarquee";

export default function Events() {
  return (
    <PageShell backdrop={<Backdrop behindNav />}>
      <Hero />
      <UpcomingEvents />
      <AllEvents />
      <LogoMarquee />
    </PageShell>
  );
}
