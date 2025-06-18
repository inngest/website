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
    <div className="align-center flex flex-col justify-between gap-2 py-24 text-center text-basis lg:items-center">
      <h1 className="mb-5 font-whyteInktrap text-4xl font-semibold leading-[48px] tracking-[-2px] sm:text-5xl sm:leading-[58px] lg:text-6xl lg:leading-[68px]">
        {title}
      </h1>

      <p
        className="max-w-xl text-balance text-sm leading-6 md:text-base md:leading-7"
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
    <div className="flex flex-col justify-between gap-8 py-24 text-basis lg:flex-row lg:items-center">
      <div className="max-w-2xl lg:w-7/12">
        <h1 className="mb-5 font-whyteInktrap text-4xl font-semibold leading-[48px] tracking-[-2px] sm:text-5xl sm:leading-[58px] lg:text-6xl lg:leading-[68px]">
          {title}
        </h1>
        <p
          className="max-w-xl text-sm leading-6 md:text-base md:leading-7"
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
        <div className="mx-auto h-auto w-[75%] max-w-lg shrink lg:w-5/12">
          <Image
            src={image}
            width="720"
            height="360"
            className="mx-auto max-h-[480px] w-auto rounded-md"
            alt={`Hero image for ${title}`}
          />
        </div>
      )}
    </div>
  );
};
