import Image from "next/image";
import Button from "./Button";
import { H2 } from "./Heading";

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
    <div className="max-w-6xl w-[90%] px-4 sm:w-auto mx-auto my-12 grid md:grid-cols-2 gap-16">
      <div className="flex flex-col items-center justify-center">
        <Image
          className="mx-auto w-full max-w-4xl rounded-md"
          src={image}
          alt={`${title} case study`}
          width={800}
          height={800}
        />
      </div>
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-muted text-sm">Case Study</p>
          <H2>{title}</H2>
        </div>
        {!!description && Array.isArray(description) ? (
          <div className="flex flex-col gap-4">
            {description.map((para, idx) => (
              <p
                key={idx}
                className="text-sm md:text-base max-w-4xl text-subtle"
              >
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm md:text-base max-w-4xl text-subtle">
            {description}
          </p>
        )}
        <div>
          <Button href={href} variant="primary">
            Read the case study
          </Button>
        </div>
      </div>
    </div>
  );
}
