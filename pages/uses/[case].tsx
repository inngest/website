import { GetStaticProps, GetStaticPaths } from "next";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark as syntaxThemeDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Footer from "src/shared/Footer";
import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import PageHeader from "src/shared/PageHeader";
import SectionHeader from "src/shared/SectionHeader";
import Learning from "src/shared/Cards/Learning";
import PageContainer from "src/shared/layout/PageContainer";
import Image from "next/image";
import Quote from "src/shared/Home/Quote";
import CodeWindow from "src/shared/CodeWindow";

import {
  IconRetry,
  IconServer,
  IconTools,
  IconUnlock,
  IconWritingFns,
  IconProps,
  IconSDK,
  IconScheduled,
  IconSteps,
  IconFiles,
  IconCompiling,
  IconPower,
} from "../../shared/Icons/duotone";

const Icons: { [key: string]: React.FC<IconProps> } = {
  Retry: IconRetry,
  Server: IconServer,
  Tools: IconTools,
  Unlock: IconUnlock,
  WritingFns: IconWritingFns,
  SDK: IconSDK,
  Scheduled: IconScheduled,
  Steps: IconSteps,
  Files: IconFiles,
  Compiling: IconCompiling,
  Power: IconPower,
};

type IconType = keyof typeof Icons;
export type UseCase = {
  slug?: string;
  title: string;
  heroImage?: string;
  lede: string;
  keyFeatures: {
    title: string;
    img?: string;
    description: string; // can be HTML
  }[];
  codeSection: {
    title: string;
    examples: {
      title?: string;
      steps: string[];
      description?: string;
      code: string;
    }[];
  };
  featureOverflowTitle?: string;
  featureOverflow: {
    title: string;
    description: string;
    icon: IconType;
  }[];
  quote?: {
    text: string;
    author: string;
    title: string;
    avatar?: string;
    logo?: string;
  };
  learnMore: {
    description: string;
    resources: {
      title: string;
      description: string;
      type: "Docs" | "Tutorial" | "Guide" | "Pattern" | "Blog";
      href: string;
    }[];
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const {
    data,
  }: { data: UseCase } = require(`../../data/uses/${ctx.params.case}.tsx`);
  const stringData = JSON.stringify({ ...data, slug: ctx.params.case });
  return {
    props: {
      stringData,
      meta: {
        title: data.title,
        description: data.lede,
      },
      designVersion: "2",
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const fs = require("node:fs");
  const fileNames = fs.readdirSync("./data/uses");

  const paths = fileNames.map((fileName) => {
    return {
      params: {
        case: fileName.replace(/\.tsx$/, ""),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export default function useCase({ stringData }) {
  const data: UseCase = JSON.parse(stringData);
  return (
    <PageContainer>
      <Header />

      <Container>
        <PageHeader
          title={data.title}
          lede={data.lede}
          image={data.heroImage}
          ctas={[
            {
              href: `${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=use-case-${data.slug}`,
              text: `Get started`,
              arrow: "right",
            },
          ]}
        />
      </Container>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-8 gap-2">
          {data.keyFeatures.map((feature, i) => (
            <div
              key={i}
              className="max-w-[600px] m-auto md:m-0 bg-surfaceSubtle overflow-hidden rounded-lg border-slate-900/10"
            >
              {Boolean(feature.img) && (
                <Image
                  alt={`Graphic of ${feature.title}`}
                  className="rounded-t-lg lg:rounded-t-none lg:rounded-r-lg group-hover:rounded-lg"
                  src={`/assets/use-cases/${feature.img}`}
                  width={600}
                  height={340}
                  quality={95}
                />
              )}
              <div className="p-6 lg:p-10">
                <h3 className="text-lg lg:text-xl text-basis mb-2.5">
                  {feature.title}
                </h3>
                <p
                  className="text-sm text-subtle leading-6"
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                ></p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <Container className=" my-40">
        <SectionHeader title={data.codeSection.title} />
        {data.codeSection.examples.map((example) => (
          <div
            className="mt-16 grid lg:grid-cols-5 md:grid-cols-1"
            key={example.title}
          >
            <div className="text-slate-200 mb-10 lg:mb-0 lg:pr-20 max-w-[480px] justify-center flex flex-col gap-3 col-span-2">
              {!!example.title && (
                <h3 className="mb-12 text-xl md:text-3xl font-semibold">
                  {example.title}
                </h3>
              )}
              {example.steps.map((step, idx) => (
                <p className="flex items-start gap-3" key={idx}>
                  <span className="bg-surfaceMuted rounded flex items-center justify-center w-6 h-6 text-xs font-bold shrink-0">
                    {example?.steps?.length === 1 ? "→" : idx + 1}
                  </span>{" "}
                  {step}
                </p>
              ))}
              <p className="text-sm text-slate-300 mt-4 ml-9">
                {example.description}
              </p>
            </div>
            <CodeWindow
              snippet={example.code}
              showLineNumbers={true}
              className="col-span-3"
            />
          </div>
        ))}
      </Container>

      {!!data.quote && (
        <Container className="flex flex-col items-center gap-4 my-48">
          <Quote
            text={data.quote.text}
            attribution={{
              name: data.quote.author,
              title: data.quote.title,
              avatar: data.quote.avatar,
              logo: data.quote.logo,
            }}
          />
        </Container>
      )}

      <Container className="my-40">
        <SectionHeader
          title={data.featureOverflowTitle || "Everything you need to build"}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-16 mt-20">
          {data.featureOverflow.map((feature, i) => (
            <div key={i}>
              <h3 className="text-slate-50 text-lg lg:text-xl mb-2 flex items-center gap-1 -ml-2">
                {feature.icon && (
                  <Icon name={feature.icon} size={30} color="matcha" />
                )}
                {feature.title}
              </h3>
              <p className="text-sm leading-loose">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container>
        <SectionHeader title="Learn more" lede={data.learnMore.description} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-16">
          {data.learnMore.resources.map((learningItem, i) => (
            <Learning
              key={i}
              href={learningItem.href}
              title={learningItem.title}
              description={learningItem.description}
              type={learningItem.type}
            />
          ))}
        </div>
      </Container>
      <Footer ctaRef={`use-case-${data.slug}`} />
    </PageContainer>
  );
}

const Icon = ({ name, ...props }: { name: IconType } & IconProps) => {
  const C = Icons[name];
  return <C {...props} />;
};
