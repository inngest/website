export default function Heading({
  title,
  lede,
  className,
}: {
  title: React.ReactNode;
  lede: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="text-[40px] leading-snug font-semibold text-white">
        {title}
      </h2>
      <p className="my-4 leading-loose text-indigo-200">{lede}</p>
    </div>
  );
}
