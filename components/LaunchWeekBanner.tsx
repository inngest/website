"use client";
import AnnouncementBanner from "src/components/AnnouncementBanner";
import ProductHuntAnnouncementBanner from "src/components/ProductHuntAnnouncementBanner";

function useIsItDay3InSFNow() {
  const d = new Date();
  const localTime = d.getTime();
  const localOffset = d.getTimezoneOffset() * 60000;
  const utc = localTime + localOffset;
  const offset = -8; // UTC of PST is -05.00
  const sfDate = new Date(utc + 3600000 * offset);

  return (
    sfDate.getDate() == 24 &&
    sfDate.getMonth() == 8 &&
    sfDate.getFullYear() === 2024
  );
}

export default function LaunchWeekBanner() {
  const day3 = useIsItDay3InSFNow();
  return day3 ? (
    <ProductHuntAnnouncementBanner />
  ) : (
    <AnnouncementBanner href="/launch-week" className="mb-4">
      Inngest Launch Week kicks off September 23rd. Follow along with all of our
      updates!
    </AnnouncementBanner>
  );
}
