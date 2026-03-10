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
    <div className="mx-auto my-12 grid w-[90%] max-w-6xl gap-16 px-4 sm:w-auto md:grid-cols-2">
      <div className="flex flex-col items-center justify-center">
        <Image
          className="mx-auto w-full max-w-4xl rounded-md"
          src={image}
          alt={`${title} customer story`}
          width={800}
          height={800}
        />
      </div>
      <div className="flex flex-col gap-8">
        <div>
          <p className="mb-2 text-sm text-muted">Customer story</p>
          <H2 className="text-2xl sm:text-4xl">{title}</H2>
        </div>
        {!!description && Array.isArray(description) ? (
          <div className="flex flex-col gap-4">
            {description.map((para, idx) => (
              <p
                key={idx}
                className="max-w-4xl text-sm text-subtle md:text-base"
              >
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p className="max-w-4xl text-sm text-subtle md:text-base">
            {description}
          </p>
        )}
        <div>
          <Button href={href} variant="primary">
            Read the customer story
          </Button>
        </div>
      </div>
    </div>
  );
}
