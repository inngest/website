"use client";
import CopyBtn from "src/shared/Home/CopyBtn";

export default function Command({ command }: { command: string }) {
  const handleCopyClick = (copy) => {
    navigator.clipboard?.writeText(copy);
  };
  return (
    <div className="flex divide-x divide-carbon-600 rounded-md border border-carbon-600 bg-carbon-900 text-sm text-slate-200 shadow-lg backdrop-blur-md">
      <pre className="py-2 pl-3 pr-2.5">
        <code className="bg-transparent text-inngestLux">$ {command}</code>
      </pre>
      <div className="flex items-center justify-center rounded-r-md pl-1.5 pr-2">
        <CopyBtn btnAction={handleCopyClick} copy={command} />
      </div>
    </div>
  );
}
