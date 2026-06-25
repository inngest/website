import classNames from "src/utils/classNames";

export default function Prose({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className={classNames(
        "prose-invert blog-content prose max-w-none text-v1-frost prose-headings:scroll-mt-[100px] prose-headings:font-v1Heading prose-headings:font-normal prose-headings:tracking-[-0.01em] prose-headings:text-v1-frost prose-h2:mb-3.5 prose-h2:mt-10 prose-h2:text-[26px] prose-h2:leading-[1.2] prose-h2:tracking-[-0.26px] prose-h3:mb-2.5 prose-h3:mt-8 prose-h3:text-[20px] prose-h3:leading-[1.3] prose-h4:mb-2 prose-h4:mt-7 prose-h4:text-[17px] prose-h4:leading-[1.4] prose-h5:mb-1.5 prose-h5:mt-6 prose-h5:text-[15px] prose-h5:leading-[1.4] prose-h6:mb-1.5 prose-h6:mt-6 prose-h6:text-[15px] prose-h6:leading-[1.4] prose-p:text-[18px] prose-p:leading-[30px] prose-p:text-[#b3b3b3] prose-a:text-v1-frost prose-a:underline prose-a:decoration-v1-frost/40 prose-a:underline-offset-4 hover:prose-a:decoration-v1-frost prose-blockquote:border-v1-accent-salmon prose-blockquote:not-italic prose-blockquote:text-v1-frost prose-blockquote:[&_p:first-of-type]:before:content-none prose-blockquote:[&_p:last-of-type]:after:content-none prose-code:rounded prose-code:bg-v1-frost/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[14px] prose-code:text-v1-accent-salmon prose-pre:rounded-[8px] prose-pre:border prose-pre:border-[rgba(124,124,124,0.35)] prose-pre:bg-v1-jetBlack prose-li:my-0 prose-li:text-[18px] prose-li:leading-[30px] prose-li:text-[#b3b3b3] prose-img:rounded-[8px] prose-img:border prose-img:border-[rgba(124,124,124,0.35)]",
        className
      )}
    >
      {children}
    </div>
  );
}
