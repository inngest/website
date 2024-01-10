import React from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

type Props = {
  href: string;
  children: React.ReactNode;
};

const PageBanner: React.FC<Props> = ({ href, children }) => (
  <a
    href={href}
    className="page-banner flex items-center justify-center gap-2.5 w-full py-2 tracking-tight bg-[#A7F3D0] bg-gradient-to-r from-[#5EEAD4] via-[#A7F3D0] to-[#FDE68A] hover:from-[#5EEAD4] hover:via-[#C9EEB5] hover:to-[#FDE68A] text-base text-slate-900 font-bold transition-all"
  >
    {children}
    <span className="inline-flex items-center ml-2 text-slate-900">
      {" "}
      Learn more <ChevronRightIcon className="h-5" />
    </span>
  </a>
);

export default PageBanner;
