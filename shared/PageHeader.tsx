import Image from "next/image";

import { Button } from "./Button";

type PageHeaderProps = {
  title: string;
  lede: string;
  image?: string;
  ctas?: {
    href: string;
    text: string;
    arrow?: "left" | "right";
  }[];
};

export default function PageHeader(props: PageHeaderProps) {
  if (!!props.image) {
    return <LeftAlignedHeader {...props} />;
  }

  const { title, lede, ctas } = props;

  return (
    <div className="py-24 flex flex-col gap-2 justify-between align-center lg:items-center text-center text-basis">
      <h1 className="text-4xl leading-[48px] sm:text-5xl sm:leading-[58px] lg:text-6xl font-semibold lg:leading-[68px] tracking-[-2px] mb-5">
        {title}
      </h1>

      <p
        className="text-sm md:text-base max-w-xl leading-6 md:leading-7 text-balance"
        dangerouslySetInnerHTML={{ __html: lede }}
      ></p>
      {Boolean(ctas?.length) && (
        <div className="mt-5">
          {ctas.map((cta) => (
            <Button {...cta}>{cta.text}</Button>
          ))}
        </div>
      )}
    </div>
  );
}

const LeftAlignedHeader = ({
  title,
  lede,
  image,
  ctas = [],
}: PageHeaderProps) => {
  return (
    <div className="py-24 flex flex-col lg:flex-row gap-8 justify-between lg:items-center text-basis">
      <div className="lg:w-7/12 max-w-2xl">
        <h1 className="text-4xl leading-[48px] sm:text-5xl sm:leading-[58px] lg:text-6xl font-semibold lg:leading-[68px] tracking-[-2px] mb-5">
          {title}
        </h1>
        <p
          className="text-sm md:text-base max-w-xl leading-6 md:leading-7"
          dangerouslySetInnerHTML={{ __html: lede }}
        ></p>
        {Boolean(ctas?.length) && (
          <div className="mt-5">
            {ctas.map((cta) => (
              <Button {...cta}>{cta.text}</Button>
            ))}
          </div>
        )}
      </div>
      {Boolean(image) && (
        <div className="shrink w-[75%] max-w-lg lg:w-5/12 h-auto mx-auto">
          <Image
            src={image}
            width="720"
            height="360"
            className="mx-auto w-auto max-h-[480px] rounded-md"
            alt={`Hero image for ${title}`}
          />
        </div>
      )}
    </div>
  );
};
