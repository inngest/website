"use client";
import CopyBtn from "src/shared/Home/CopyBtn";

export default function Command({ command }: { command: string }) {
  const handleCopyClick = (copy) => {
    navigator.clipboard?.writeText(copy);
  };
  return (
    <div className="bg-white/10 backdrop-blur-md flex rounded text-sm text-slate-200 shadow-lg">
      <pre className=" pl-4 pr-2 py-2">
        <code className="bg-transparent text-slate-300">{command}</code>
      </pre>
      <div className="rounded-r flex items-center justify-center pl-2 pr-2.5">
        <CopyBtn btnAction={handleCopyClick} copy={command} />
      </div>
    </div>
  );
}
