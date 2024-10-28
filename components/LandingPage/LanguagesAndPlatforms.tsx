export default function LanguagesAndPlatforms() {
  return (
    <div className="max-w-6xl w-[90%] sm:px-4 sm:w-auto mx-auto my-12 sm:my-24">
      <div className="flex flex-col lg:flex-row max-w-2xl lg:max-w-none sm:mx-auto text-basis gap-10 md:gap-12 justify-between">
        <div className="flex flex-col items-start gap-6 sm:gap-8 grow basis-5/12">
          <p className="text-balance shrink text-left text-xl sm:text-2xl">
            Write functions in any language that works for you.
          </p>
          <div className="grid grid-cols-3 w-full sm:w-auto border border-muted divide-x divide-muted rounded-lg">
            {[
              {
                title: "TypeScript",
                logo: "/assets/brand-logos/outline/typescript.svg",
              },
              {
                title: "Python",
                logo: "/assets/brand-logos/outline/python.svg",
              },
              {
                title: "Go",
                logo: "/assets/brand-logos/outline/go.svg",
              },
            ].map(({ title, logo }, idx) => (
              <Item key={idx} logo={logo} title={title} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 md:gap-8 grow basis-7/12">
          <p className="text-balance shrink text-left text-xl sm:text-2xl">
            Run functions in your own infrastructure, on serverless, servers, or
            edge.
          </p>
          <div className="grid grid-cols-5 w-full sm:w-auto border border-muted divide-x divide-muted rounded-lg">
            {[
              {
                title: "Vercel",
                logo: "/assets/brand-logos/outline/vercel.svg",
              },
              {
                title: "Netlify",
                logo: "/assets/brand-logos/outline/netlify.svg",
              },
              {
                title: "AWS",
                logo: "/assets/brand-logos/outline/aws.svg",
              },
              {
                title: "GCP",
                logo: "/assets/brand-logos/outline/gcp.svg",
              },
              {
                title: "Azure",
                logo: "/assets/brand-logos/outline/azure.svg",
              },
            ].map(({ title, logo }, idx) => (
              <Item key={idx} logo={logo} title={title} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Item({ logo, title }: { logo: string; title: string }) {
  return (
    <div className="sm:h-32 sm:w-32 py-4 sm:py-0 flex flex-col items-center gap-4 justify-center">
      <img src={logo} alt={`${title}'s logo`} className="h-6 sm:h-8" />
      <p className="text-center text-sm">{title}</p>
    </div>
  );
}
