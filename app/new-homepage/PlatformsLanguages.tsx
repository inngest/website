import Container from "./Container";

export default function PlatformsLanguages() {
  return (
    <Container>
      <div className="flex flex-col lg:flex-row max-w-2xl lg:max-w-none mx-4 sm:mx-auto text-basis gap-16 md:gap-12 justify-between">
        <div className="flex flex-col sm:mx-12 md:mx-auto md:flex-row gap-10 md:gap-8 grow basis-5/12">
          <p className="text-balance shrink text-center sm:text-left md:max-w-32">
            Write functions in any language.
          </p>
          {/* TODO - These vectors look terrible */}
          <div className="flex flex-row justify-between grow gap-6">
            {[
              {
                title: "TypeScript",
                logo: "/assets/homepage/gradient-graphics/logo-typescript.svg",
              },
              {
                title: "Python",
                logo: "/assets/homepage/gradient-graphics/logo-python.svg",
              },
              {
                title: "Go",
                logo: "/assets/homepage/gradient-graphics/logo-golang.svg",
              },
            ].map(({ title, logo }, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-4 justify-between"
              >
                <img src={logo} alt={`${title}'s logo`} className="h-8" />
                <p className="text-center">{title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block px-px bg-[#1CB4D5] bg-gradient-to-b from-cyan-500 to-blue-500 h-18"></div>
        <div className="flex flex-col sm:mx-12 md:mx-auto md:flex-row gap-10 md:gap-8 grow basis-7/12">
          <p className="text-balance shrink text-center sm:text-left md:max-w-48">
            Functions run on your own infrastructure: serverless, servers, or
            edge.
          </p>
          <div className="flex flex-row justify-between grow gap-6">
            {[
              {
                title: "Vercel",
                logo: "/assets/homepage/gradient-graphics/logo-vercel.svg",
              },
              {
                title: "Netlify",
                logo: "/assets/homepage/gradient-graphics/logo-netlify.svg",
              },
              {
                title: "AWS",
                logo: "/assets/homepage/gradient-graphics/logo-aws.svg",
              },
              {
                title: "GCP",
                logo: "/assets/homepage/gradient-graphics/logo-gcp.svg",
              },
              {
                title: "Azure",
                logo: "/assets/homepage/gradient-graphics/logo-azure.svg",
              },
            ].map(({ title, logo }, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-4 justify-between"
              >
                <img src={logo} alt={`${title}'s logo`} className="h-8" />
                <p className="text-center">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
