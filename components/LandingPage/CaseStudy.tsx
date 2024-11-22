import Image from "next/image";
import CTA from "./CTA";

export default function CaseStudy({
  title,
  description,
  href,
  image,
}: {
  title: string;
  description: string | string[];
  href: string;
  image: string;
}) {
  return (
    <div className="max-w-6xl w-[90%] px-4 sm:w-auto mx-auto my-12 grid md:grid-cols-2 gap-12">
      <div className="flex flex-col items-center justify-center">
        <Image
          className="mx-auto w-full max-w-4xl rounded-md"
          src={image}
          alt={`${title} case study`}
          width={800}
          height={800}
        />
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-muted text-sm">Case Study</p>
        <h2 className="text-xl sm:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-br from-[rgb(var(--color-carbon-200))] to-[rgb(var(--color-carbon-50))]">
          {title}
        </h2>
        {!!description && Array.isArray(description) ? (
          <div className="flex flex-col gap-4">
            {description.map((para, idx) => (
              <p className="text-base md:text-lg max-w-4xl text-subtle">
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-base md:text-lg max-w-4xl text-subtle">
            {description}
          </p>
        )}
        <CTA text="Read the case study" href={href} />
      </div>
    </div>
  );
}
