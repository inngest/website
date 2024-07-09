"use client";
import CopyBtn from "src/shared/Home/CopyBtn";

export default function Command({ command }: { command: string }) {
  const handleCopyClick = (copy) => {
    navigator.clipboard?.writeText(copy);
  };
  return (
    <div className="bg-carbon-900 backdrop-blur-md flex rounded-md text-sm text-slate-200 shadow-lg border border-carbon-600 divide-x divide-carbon-600">
      <pre className="pl-3 pr-2.5 py-2">
        <code className="bg-transparent text-matcha-200">$ {command}</code>
      </pre>
      <div className="rounded-r-md flex items-center justify-center pl-1.5 pr-2">
        <CopyBtn btnAction={handleCopyClick} copy={command} />
      </div>
    </div>
  );
}
