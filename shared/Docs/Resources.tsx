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

// Icons available for direct use in MDX
const icons = {
  "paper-airplane": PaperAirplaneIcon,
  clock: ClockIcon,
  "arrows-pointing-out": ArrowsPointingOutIcon,
  "chevron-double-right": ChevronDoubleRightIcon,
  "square-3-stack-3d": Square3Stack3DIcon,
  parallel: ParallelIcon,
  "rectangle-group": RectangleGroupIcon,
} as const;

type IconType = keyof typeof icons;

const patterns = [
  {
    y: 16,
    squares: [
      [0, 1],
      [1, 3],
    ],
  },
  {
    y: -6,
    squares: [
      [-1, 2],
      [1, 3],
    ],
  },
  {
    y: 32,
    squares: [
      [0, 2],
      [1, 4],
    ],
  },
  {
    y: 22,
    squares: [[0, 1]],
  },
];

const resources = [
  {
    href: "/contacts",
    name: "Contacts",
    description:
      "Learn about the contact model and how to create, retrieve, update, delete, and list contacts.",
    icon: UserIcon,
    pattern: {
      y: 16,
      squares: [
        [0, 1],
        [1, 3],
      ],
    },
  },
  {
    href: "/conversations",
    name: "Conversations",
    description:
      "Learn about the conversation model and how to create, retrieve, update, delete, and list conversations.",
    icon: ChatBubbleIcon,
    pattern: {
      y: -6,
      squares: [
        [-1, 2],
        [1, 3],
      ],
    },
  },
  {
    href: "/messages",
    name: "Messages",
    description:
      "Learn about the message model and how to create, retrieve, update, delete, and list messages.",
    icon: EnvelopeIcon,
    pattern: {
      y: 32,
      squares: [
        [0, 2],
        [1, 4],
      ],
    },
  },
  {
    href: "/groups",
    name: "Groups",
    description:
      "Learn about the group model and how to create, retrieve, update, delete, and list groups.",
    icon: UsersIcon,
    pattern: {
      y: 22,
      squares: [[0, 1]],
    },
  },
];

function ResourceIcon({ icon: Icon }) {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/5 ring-1 ring-slate-900/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50 group-hover:ring-slate-900/25 dark:bg-white/7.5 dark:ring-white/15 dark:group-hover:bg-indigo-300/10 dark:group-hover:ring-indigo-400">
      <Icon className="h-4 w45 fill-slate-700/10 stroke-slate-700 transition-colors duration-300 group-hover:stroke-slate-900 dark:fill-white/10 dark:stroke-slate-400 dark:group-hover:fill-indigo-300/10 dark:group-hover:stroke-indigo-400" />
    </div>
  );
}

function ResourcePattern({ mouseX, mouseY, ...gridProps }) {
  let maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-lg transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 dark:fill-white/1 dark:stroke-white/2.5"
          {...gridProps}
        />
      </div>
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-50 to-sky-100 opacity-0 transition duration-300 group-hover:opacity-100 dark:from-[#202D2E] dark:to-[#303428]"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
        style={style}
      >
        <GridPattern
          width={72}
          height={56}
          x="50%"
          className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 dark:fill-white/2.5 dark:stroke-white/10"
          {...gridProps}
        />
      </motion.div>
    </div>
  );
}

export function Resource({
  resource,
}: {
  resource: {
    href: string;
    name: string;
    description?: string;
    logo?: { dark: string; light: string };
    pattern: 0 | 1 | 2 | 3 | object | null;
    icon?: IconType | ((any) => JSX.Element);
    image?: string;
  };
}) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const pattern =
    resource.pattern === null
      ? patterns[0]
      : typeof resource.pattern === "number"
      ? patterns[resource.pattern]
      : resource.pattern;

  const icon =
    typeof resource.icon === "string" && icons.hasOwnProperty(resource.icon)
      ? icons[resource.icon]
      : resource.icon;

  return (
    <div
      key={resource.href}
      onMouseMove={onMouseMove}
      className="group relative flex flex-col rounded-lg bg-slate-50 transition-shadow hover:shadow-md hover:shadow-slate-900/5 dark:bg-white/2.5 dark:hover:shadow-black/5 p-4"
    >
      <ResourcePattern {...pattern} mouseX={mouseX} mouseY={mouseY} />
      <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-slate-900/7.5 group-hover:ring-slate-900/10 dark:ring-white/10 dark:group-hover:ring-white/20" />
      <Link
        href={resource.href}
        className="w-full text-slate-900 dark:text-slate-200 hover:text-slate-700 hover:dark:text-slate-50"
      >
        <div className="relative rounded-lg px-4 py-4">
          {!!resource.image && (
            <div className="flex justify-center mb-4">
              <img
                src={resource.image}
                alt={resource.name}
                className="rounded-lg h-32 w-3/4 object-cover filter saturate-50 transition duration-300 ease-in-out group-hover:saturate-100"
              />
            </div>
          )}
          {!!resource.logo && (
            <>
              <img
                src={resource.logo.light}
                alt={resource.name}
                className="dark:hidden h-12 max-w-[160px]"
              />
              <img
                src={resource.logo.dark}
                alt={resource.name}
                className="hidden dark:inline h-12 max-w-[160px]"
              />
            </>
          )}
          {!!icon && <ResourceIcon icon={icon} />}
          <h3 className="mt-4 text-m font-semibold leading-6">
            {resource.name}
          </h3>
          {resource.description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {resource.description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

export function Resources() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="resources">
        Resources
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-slate-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:grid-cols-4">
        {resources.map((resource) => (
          <Resource key={resource.href} resource={resource} />
        ))}
      </div>
    </div>
  );
}

export function ResourceGrid({ cols = 4, border = true, children }) {
  return (
    <div
      className={`xl:max-w-none not-prose grid grid-cols-1 gap-8
      sm:grid-cols-${cols >= 2 ? 2 : cols} xl:grid-cols-${cols}
      ${
        border
          ? "mt-4 border-t border-slate-900/5 pt-10 dark:border-white/5"
          : ""
      }`}
    >
      {children}
    </div>
  );
}
