import Image from "next/image";
import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import Footer from "src/shared/Footer";
import Blockquote from "src/shared/Blog/Blockquote";

export type Props = {
  children: React.ReactNode;
  /* The title automatically pulled from the h1 tag in each mdx file */
  title: string;
  /* The optional title used for meta tags (set via export const metaTitle = '...') */
  metaTitle?: string;

  /* Customer info */
  logo: string;
  companyName: string;
  quote: {
    text: string;
    attribution: {
      name: string;
      title: string;
    };
    avatar: string;
  };
  companyDescription: string;
  companyURL: string;

  /* The optional description */
  description?: string;
};

export function Layout({
  children,
  title,
  logo,
  companyName,
  quote,
  companyDescription,
  companyURL,
  metaTitle,
  description,
}: Props) {
  // TODO - metatags
  return (
    <div className="bg-slate-1000 font-sans">
      <Header />
      <Container>
        <div className="mx-auto my-12 flex flex-col items-start justify-between md:flex-row gap-8 max-w-[1200px]">
          <article className="max-w-[80ch]">
            <div className="mb-4 text-sm font-medium text-slate-500">
              Case Study - {companyName}
            </div>
            <h1 className="mr-8 text-4xl leading-[3rem] font-medium">
              {title}
            </h1>

            <blockquote className="mx-auto my-8 max-w-3xl px-8 md:p-16 flex flex-col md:flex-row gap-8 bg-[url(/assets/textures/wave.svg)] bg-[length:auto_80%] bg-center bg-no-repeat">
              <p className="text-lg leading-7 relative">
                <span className="absolute top-1 -left-4 text-2xl leading-3 text-slate-400/80">
                  &ldquo;
                </span>
                {quote.text}
                <span className="ml-1 text-2xl leading-3 text-slate-400/80">
                  &rdquo;
                </span>
              </p>
              <footer className="min-w-[180px] flex flex-col gap-4">
                <Image
                  src={quote.avatar}
                  alt={`Image of ${quote.attribution.name}`}
                  height="72"
                  width="72"
                  className="rounded-full h-12 w-12 lg:h-20 lg:w-20"
                />
                <cite className="text-slate-300 leading-8 not-italic">
                  <span className="text-lg">{quote.attribution.name}</span>
                  <br />
                  <span className="text-sm">{quote.attribution.title}</span>
                </cite>
              </footer>
            </blockquote>

            <div className="max-w-[70ch] prose mt-12 mb-20 prose-img:rounded-lg prose-code:bg-slate-800 prose-code:tracking-tight text-slate-300 prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-white prose-a:font-medium prose-a:transition-all prose-invert blog-content">
              {children}
            </div>
          </article>
          <aside className="flex flex-col gap-6 md:w-[260px] px-8 py-4 mt-8 justify-between rounded-md md:border-l border-slate-100/10">
            <img
              src={logo}
              alt={`${companyName}'s logo`}
              className="w-full max-w-[160px] mb-4"
            />
            <p>{companyDescription}</p>
            <p>
              <a
                href={companyURL}
                target="_blank"
                className="text-slate-400 hover:text-indigo-400"
              >
                {companyURL.replace(/https\:\/\//, "")}
              </a>
            </p>
          </aside>
        </div>
      </Container>
      <Footer />
    </div>
  );
}
