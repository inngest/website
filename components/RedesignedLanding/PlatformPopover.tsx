import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  AdjustmentsHorizontalIcon,
  ArrowPathRoundedSquareIcon,
  CloudArrowUpIcon,
  EyeIcon,
  PuzzlePieceIcon,
  QueueListIcon,
  ScaleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
const solutions = [
  {
    name: "AI + AI Agents",
    href: "/ai?ref=nav",
    icon: SparklesIcon,
  },
  {
    name: "Queuing",
    href: "/compare-to-legacy-queues?ref=nav",
    icon: QueueListIcon,
  },
  {
    name: "Recovery",
    href: "#",
    icon: ArrowPathRoundedSquareIcon,
  },
  {
    name: "Orchestration",
    href: "#",
    icon: AdjustmentsHorizontalIcon,
  },
  {
    name: "Monitoring",
    href: "#",
    icon: EyeIcon,
  },
  {
    name: "Load Balancing",
    href: "#",
    icon: ScaleIcon,
  },
  {
    name: "Deployment",
    href: "#",
    icon: CloudArrowUpIcon,
  },
  {
    name: "Integration",
    href: "#",
    icon: PuzzlePieceIcon,
  },
];

export default function PlatformPopover() {
  return (
    <Popover className="relative">
      <PopoverButton className="inline-flex items-center font-circular text-sm/6 font-semibold">
        <span>PLATFORM</span>
        <ChevronDownIcon aria-hidden="true" className="size-4" />
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute left-0 right-0 z-10 mt-5 w-screen max-w-max px-4 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in sm:left-1/2 sm:-translate-x-1/2 sm:px-0"
      >
        <div className="mx-auto w-full max-w-md overflow-hidden border border-stone-700 bg-stone-900 text-sm/6 shadow-lg ring-1 ring-gray-900/5 lg:max-w-3xl">
          <div className="grid grid-cols-1 gap-x-6 gap-y-1 p-4 lg:grid-cols-2">
            {solutions.map((item) => (
              <div
                key={item.name}
                className="group relative flex items-center gap-x-6 rounded-sm px-4 py-2 hover:bg-stone-800"
              >
                <div className="flex size-11 flex-none items-center justify-center bg-gray-50 group-hover:bg-white">
                  <item.icon aria-hidden="true" className="size-6 text-black" />
                </div>
                <div>
                  <a href={item.href} className="font-semibold  text-white">
                    {item.name}
                    <span className="absolute inset-0" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  );
}
