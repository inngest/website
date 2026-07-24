import { notFound } from "next/navigation";
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
} from "src/shared/Icons/duotone";

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

async function getUseCase(slug: string): Promise<UseCase | null> {
  try {
    const { data } = require(`../../../data/uses/${slug}.tsx`);
    return { ...data, slug };
  } catch (error) {
    return null;
  }
}

export async function generateStaticParams() {
  const fs = require("node:fs");
  const fileNames = fs.readdirSync("./data/uses");

  return fileNames.map((fileName) => ({
    case: fileName.replace(/\.tsx$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  // `params` is provided as a Promise based on Next.js generated `PageProps`
  params: Promise<{ case: string }>;
}) {
  const { case: caseSlug } = await params;
  const data = await getUseCase(caseSlug);

  if (!data) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: data.title,
    description: data.lede,
  };
}

export default async function UseCasePage({
  params,
}: {
  // The `params` prop is typed as a Promise to satisfy Next.js's generated `PageProps`.
  params: Promise<{ case: string }>;
}) {
  const { case: caseSlug } = await params;
  const data = await getUseCase(caseSlug);

  if (!data) {
    notFound();
  }

  return (
    <PageContainer>
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
        <div className="mt-8 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {data.keyFeatures.map((feature, i) => (
            <div
              key={i}
              className="m-auto max-w-[600px] overflow-hidden rounded-lg border-slate-900/10 bg-surfaceSubtle md:m-0"
            >
              {Boolean(feature.img) && (
                <Image
                  alt={`Graphic of ${feature.title}`}
                  className="rounded-t-lg group-hover:rounded-lg lg:rounded-r-lg lg:rounded-t-none"
                  src={`/assets/use-cases/${feature.img}`}
                  width={600}
                  height={340}
                  quality={95}
                />
              )}
              <div className="p-6 lg:p-10">
                <h3 className="mb-2.5 text-lg text-basis lg:text-xl">
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-6 text-subtle"
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
            className="mt-16 grid md:grid-cols-1 lg:grid-cols-5"
            key={example.title}
          >
            <div className="col-span-2 mb-10 flex max-w-[480px] flex-col justify-center gap-3 text-slate-200 lg:mb-0 lg:pr-20">
              {!!example.title && (
                <h3 className="mb-12 text-xl font-semibold md:text-3xl">
                  {example.title}
                </h3>
              )}
              {example.steps.map((step, idx) => (
                <p className="flex items-start gap-3" key={idx}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-surfaceMuted text-xs font-bold">
                    {example?.steps?.length === 1 ? "→" : idx + 1}
                  </span>{" "}
                  {step}
                </p>
              ))}
              <p className="ml-9 mt-4 text-sm text-slate-300">
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
        <Container className="my-48 flex flex-col items-center gap-4">
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
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-16">
          {data.featureOverflow.map((feature, i) => (
            <div key={i}>
              <h3 className="-ml-2 mb-2 flex items-center gap-1 text-lg text-slate-50 lg:text-xl">
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
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
    </PageContainer>
  );
}

const Icon = ({ name, ...props }: { name: IconType } & IconProps) => {
  const C = Icons[name];
  return <C {...props} />;
};
