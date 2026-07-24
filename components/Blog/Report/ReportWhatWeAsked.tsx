import { REPORT_TEXT_WIDTH } from "./constants";

type Props = {
  questions: string[];
};

/** Survey questions block — matches the PDF "What we asked" sections. */
export function ReportWhatWeAsked({ questions }: Props) {
  return (
    <div className={`not-prose my-8 ${REPORT_TEXT_WIDTH}`}>
      <p className="font-semibold text-basis">What we asked</p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-subtle marker:text-muted">
        {questions.map((question) => (
          <li key={question} className="pl-1 leading-relaxed">
            {question}
          </li>
        ))}
      </ol>
    </div>
  );
}
