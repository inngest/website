import ButtonLink from "@/components/v1/ButtonLink";
import GradientFrame from "@/components/v1/sections/shared/GradientFrame";
import type { CustomerStoryData } from "@/components/v1/sections/CustomerStory/types";

// Right info card (162:17529).
export default function InfoCard({ story }: { story: CustomerStoryData }) {
  return (
    <GradientFrame
      variant="black"
      className="rounded-md lg:col-span-1 lg:sticky lg:top-[100px]"
      innerClassName="flex flex-col gap-[75px] p-8"
    >
      <div className="flex flex-col gap-[30px]">
        <img
          src={story.brandLogo}
          alt={story.brandLogoAlt}
          className="h-6 w-auto self-start"
        />
        <h2 className="text-v1-heading-sm text-white">{story.cardHeadline}</h2>
        <div className="flex flex-col gap-6">
          {story.brandSiteHref && (
            <a
              href={story.brandSiteHref}
              target="_blank"
              rel="noreferrer noopener"
              className="text-v1-body-lg inline-block w-fit text-v1-accent-salmon-light underline decoration-solid underline-offset-2"
            >
              {story.brandSiteLabel ?? story.brandSiteHref}
            </a>
          )}
          {story.meta.length > 0 && (
            <dl className="flex flex-col gap-0.5">
              {story.meta.map((row) => (
                <div key={row.key} className="text-v1-body-sm-loose text-white">
                  <dt className="inline">{row.key}: </dt>
                  <dd className="inline text-white/70">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="text-v1-body-sm-loose text-white">Interested in Inngest?</p>
        <ButtonLink
          href="/get-in-touch?ref=customer-story"
          variant="accent"
          size="md"
          className="self-start"
        >
          Talk to a product expert
        </ButtonLink>
      </div>
    </GradientFrame>
  );
}
