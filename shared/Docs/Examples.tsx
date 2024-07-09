import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

import { GridPattern } from "./GridPattern";
import { Heading } from "./Heading";
import { ChatBubbleIcon } from "./icons/ChatBubbleIcon";
import { EnvelopeIcon } from "./icons/EnvelopeIcon";
import { UserIcon } from "./icons/UserIcon";
import { UsersIcon } from "./icons/UsersIcon";
import {
  PaperAirplaneIcon,
  ClockIcon,
  ArrowsPointingOutIcon,
  Square3Stack3DIcon,
  ChevronDoubleRightIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import ParallelIcon from "src/shared/Icons/Parallel";

export function Example({
  example,
}: {
  example: {
    href: string;
    title: string;
    description?: string;
    technology?: "";
    author?: string;
    authorSocial?: string;
    demo?: string;
    github: string;
    image?: string;
  };
}) {
  return (
    <div className="group relative flex flex-col sm:flex-col rounded-lg bg-slate-50 transition-shadow hover:shadow-md hover:shadow-slate-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5 ring-1 ring-inset ring-slate-900/7.5 group-hover:ring-slate-900/10 dark:ring-white/10 dark:group-hover:ring-white/20 p-4">
      <div className="flex justify-center mb-4">
        <img
          className="relative flex rounded-lg h-48 w-full object-cover"
          src={example.image}
        />
      </div>
      <div className="relative">
        <h3 className="mt-4 text-m font-semibold text-center">
          {example.title}
        </h3>
        {example.description && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {example.description}
          </p>
        )}
        {example.technology && (
          <ExampleInfo label="Technology used">
            {example.technology}
          </ExampleInfo>
        )}
        <ExampleInfo label="Explore">
          <Link
            href={example.github}
            className="hover:text-slate-600 dark:hover:text-slate-400 hover:underline"
          >
            Code
          </Link>
          {example.demo && (
            <>
              {" | "}{" "}
              <Link
                href={example.demo}
                className="hover:text-slate-600 dark:hover:text-slate-400 hover:underline"
              >
                Demo
              </Link>
            </>
          )}
        </ExampleInfo>
        <ExampleInfo label="Made by">
          {example.authorSocial ? (
            <Link
              href={example.authorSocial}
              className="hover:text-slate-600 dark:hover:text-slate-400 hover:underline"
            >
              {" "}
              {example.author}{" "}
            </Link>
          ) : (
            example.author ?? "Inngest Team"
          )}
        </ExampleInfo>
      </div>
    </div>
  );
}

const ExampleInfo: React.FC<React.PropsWithChildren<{ label: string }>> = ({
  label,
  children,
}) => {
  return (
    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
      <span className="text-sm font-semibold">{label}: </span>
      {children}
    </div>
  );
};
