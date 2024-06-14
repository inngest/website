export default function Card({ children }) {
  return (
    <div className="p-px rounded-md bg-gradient-to-r from-[#14B8A6] to-[#21AFFF]">
      <div className="flex flex-col gap-2 p-4 bg-background rounded-md text-body">
        {children}
      </div>
    </div>
  );
}
