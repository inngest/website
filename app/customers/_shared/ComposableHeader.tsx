import { cn } from "components/utils/classNames";

export interface InfoBlockData {
  header: string;
  description: string;
}

interface CompanyDetailsData {
  website: {
    prefix: string;
    url: string;
    link?: string;
    isLinked?: boolean;
  };
  logo: React.ReactNode;
  description: string;
}

interface BackgroundPatterns {
  left: React.ReactNode;
  right: React.ReactNode;
}

interface ComposableHeaderProps {
  title: string;
  highlightedText?: string;
  subtitle: string;
  backgroundPatterns: BackgroundPatterns;
  infoBlocks: InfoBlockData[];
  companyDetails: CompanyDetailsData;
  backgroundColor?: string;
}

function WebsiteLink({
  website,
  className = "",
}: {
  website: CompanyDetailsData["website"];
  className?: string;
}) {
  const content = (
    <div className="group">
      <p className={cn(className, "mb-0 group-hover:underline")}>
        {website.prefix}
      </p>
      <p
        className={cn(
          className,
          website.isLinked && "cursor-pointer group-hover:underline"
        )}
      >
        {website.url}
      </p>
    </div>
  );

  if (website.isLinked && website.link) {
    return (
      <a
        href={website.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}

export function ComposableHeader({
  title,
  highlightedText,
  subtitle,
  backgroundPatterns,
  infoBlocks,
  companyDetails,
}: ComposableHeaderProps) {
  return (
    <div className="relative h-full overflow-hidden bg-[#E2E2E2]">
      <div className="absolute inset-0">
        <div className="flex h-full w-full flex-row">
          <div className="h-full w-full overflow-hidden lg:w-1/2 [&>svg]:block [&>svg]:h-full [&>svg]:min-h-full [&>svg]:w-full [&>svg]:min-w-full [&>svg]:scale-125 [&>svg]:object-cover lg:[&>svg]:scale-100 lg:[&>svg]:object-fill">
            {backgroundPatterns.left}
          </div>
          <div className="hidden h-full w-1/2 lg:-ml-px lg:block [&>svg]:block [&>svg]:h-full [&>svg]:w-full [&>svg]:object-fill">
            {backgroundPatterns.right}
          </div>
        </div>
      </div>

      <div className="relative z-10 hidden h-full xl:block">
        <div className="mx-auto flex h-full max-w-container-desktop items-start justify-between gap-6 px-8 pb-20 2xl:gap-12">
          <div className="max-w-5xl self-end pb-32">
            <h1 className="text-balance font-whyte text-7xl font-normal leading-none text-stone-800 md:tracking-tight">
              {title}
              {highlightedText && (
                <span className="font-whyteInktrap">{highlightedText}</span>
              )}
              {subtitle}
            </h1>
          </div>

          <div className="mr-5 mt-12 flex w-96 flex-col justify-between pb-8">
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                {infoBlocks.slice(0, 2).map((block, index) => (
                  <InfoBlock
                    key={index}
                    header={block.header}
                    description={block.description}
                  />
                ))}
              </div>

              {infoBlocks.length > 2 && (
                <div className="grid grid-cols-2 gap-8">
                  {infoBlocks.slice(2, 4).map((block, index) => (
                    <InfoBlock
                      key={index + 2}
                      header={block.header}
                      description={block.description}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-3 text-balance pb-12 pt-20">
                {companyDetails.logo}
              </div>

              <div className="py-12">
                <WebsiteLink
                  website={companyDetails.website}
                  className="font-whyteMono text-2xl text-stone-800"
                />
              </div>

              <p className="pt-12 font-circular text-2xl font-light leading-[1.4] text-stone-800">
                {companyDetails.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tablet layout - Large screens (1024px-1279px) */}
      <div className="relative z-10 hidden h-full lg:block xl:hidden">
        <div className="flex h-full items-start gap-8 p-8 pb-24">
          <div className="max-w-4xl self-end">
            <h1 className="text-balance font-whyte text-5xl font-normal text-stone-800 md:leading-tight md:tracking-tight">
              {title}
              {highlightedText && (
                <span className="font-whyteInktrap">{highlightedText}</span>
              )}
              {subtitle}
            </h1>
          </div>

          <div className="mt-8 flex w-80 flex-col justify-between pb-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {infoBlocks.slice(0, 2).map((block, index) => (
                  <InfoBlockTablet
                    key={index}
                    header={block.header}
                    description={block.description}
                  />
                ))}
              </div>

              {infoBlocks.length > 2 && (
                <div className="grid grid-cols-2 gap-6">
                  {infoBlocks.slice(2, 4).map((block, index) => (
                    <InfoBlockTablet
                      key={index + 2}
                      header={block.header}
                      description={block.description}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="items-center justify-start space-x-3 py-12">
                <div className="origin-left scale-75">
                  {companyDetails.logo}
                </div>
              </div>

              <div>
                <WebsiteLink
                  website={companyDetails.website}
                  className="mb-4 text-xl text-stone-800"
                />

                <p className="font-circular text-xl font-light leading-[1.4] text-stone-800">
                  {companyDetails.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medium layout - Medium screens (768px-1023px) */}
      <div className="relative z-10 hidden flex-col p-8 md:flex lg:hidden">
        <div className="mb-8">
          <h1 className="text-balance font-whyte text-4xl font-normal leading-tight tracking-tight text-stone-800 md:text-5xl">
            {title}
            {highlightedText && (
              <span className="font-whyteInktrap">{highlightedText}</span>
            )}
            {subtitle}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-8 font-whyteMono">
            <div>
              <WebsiteLink
                website={companyDetails.website}
                className="text-xl text-stone-800"
              />
            </div>

            <div>
              <div className="origin-left scale-90">{companyDetails.logo}</div>
            </div>

            <div>
              <p className="font-circular text-xl font-light leading-relaxed text-stone-800">
                {companyDetails.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {infoBlocks.map((block, index) => (
                <InfoBlockTablet
                  key={index}
                  header={block.header}
                  description={block.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="relative z-10 flex flex-col p-6 py-20 md:hidden">
        <div className="mb-8">
          <h1 className="text-balance font-whyte text-4xl font-normal tracking-tight text-stone-800">
            {title}
            {highlightedText && (
              <span className="font-whyteInktrap font-normal">
                {highlightedText}
              </span>
            )}
            {subtitle}
          </h1>
        </div>

        <div className="mb-8 font-whyteMono">
          <WebsiteLink
            website={companyDetails.website}
            className="text-lg text-stone-800"
          />
        </div>

        <div className="mb-8">
          <div className="origin-left scale-[70%]">{companyDetails.logo}</div>
        </div>

        <div className="mb-8">
          <p className="font-circular text-lg font-light leading-relaxed text-stone-800">
            {companyDetails.description}
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {infoBlocks.slice(0, 2).map((block, index) => (
              <InfoBlock
                key={index}
                header={block.header}
                description={block.description}
              />
            ))}
          </div>

          {infoBlocks.length > 2 && (
            <div className="grid grid-cols-2 gap-6">
              {infoBlocks.slice(2, 4).map((block, index) => (
                <InfoBlock
                  key={index + 2}
                  header={block.header}
                  description={block.description}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({
  header,
  description,
}: {
  header: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="mb-2 font-circular text-lg font-[450] leading-[140%] text-carbon-800 md:text-2xl md:font-medium">
        {header}
      </h3>
      <p className="font-circular text-lg font-light leading-[140%] text-carbon-900 md:text-2xl">
        {description}
      </p>
    </div>
  );
}

function InfoBlockTablet({
  header,
  description,
}: {
  header: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-medium text-carbon-800">{header}</h3>
      <p className="font-circular text-xl font-light text-carbon-900">
        {description}
      </p>
    </div>
  );
}
