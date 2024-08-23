import {
  type HighlightedCode,
  type RawCode,
  Pre,
  AnnotationHandler,
  InnerLine,
  // @ts-ignore
} from "codehike/code";

import TypeScript from "shared/Icons/TypeScript";
import ReactIcon from "shared/Icons/React";
import Python from "../Icons/Python";

const languageIcons = {
  typescript: TypeScript,
  python: Python,
  jsx: ReactIcon,
};

export function Code({ codeblock }: { codeblock: HighlightedCode }) {
  const lang = codeblock.lang;
  const { title } = extractFlags(codeblock);

  const pre = (
    <Pre
      code={codeblock}
      handlers={[mark]}
      className="group py-4 font-mono leading-relaxed"
    />
  );
  const LanguageIcon = languageIcons[lang];
  const language = LanguageIcon ? (
    <LanguageIcon size={5} fill={"white"} />
  ) : (
    <span className="p-1.5 rounded-sm bg-slate-700/50 font-mono text-xs">
      {lang}
    </span>
  );
  return (
    <div className="relative border border-slate-700/50 text-sm rounded-md">
      {title ? (
        <div className="flex flex-row justify-between items-center py-1.5 px-4 border-b border-slate-800/50 bg-slate-800/50 font-mono">
          <div>{title}</div>
          {language}
        </div>
      ) : (
        <div className="absolute top-2 right-2">{language}</div>
      )}
      {pre}
    </div>
  );
}

const mark: AnnotationHandler = {
  name: "mark",
  AnnotatedLine: ({ annotation, ...props }) => (
    <InnerLine
      merge={props}
      data-mark={true}
      className="bg-slate-800/50 group-hover:bg-slate-800/80 transition-all border-l-2 border-emerald-200"
    />
  ),
  Line: (props) => <InnerLine merge={props} className="px-6 text-wrap" />,
};

export function extractFlags(codeblock: RawCode) {
  const flags =
    codeblock.meta.split(" ").filter((flag) => flag.startsWith("-"))[0] ?? "";
  const title =
    codeblock.meta === flags
      ? ""
      : codeblock.meta.replace(" " + flags, "").trim();
  return { title, flags: flags.slice(1).split("") };
}
