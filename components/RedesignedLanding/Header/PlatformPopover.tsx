"use client";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useState, useRef } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "src/components/RedesignedLanding/Header/Popover";

export const platformDropdown = [
  {
    name: "AI & Agents",
    href: "/ai?ref=nav",
    description: "Build AI agents with Inngest",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.25 5.27344C12.0914 5.27344 12.7734 4.59137 12.7734 3.75H13.4766C13.4766 4.59137 14.1586 5.27344 15 5.27344V5.97656C14.1586 5.97656 13.4766 6.65863 13.4766 7.5H12.7734C12.7734 6.65863 12.0914 5.97656 11.25 5.97656V5.27344ZM3.125 9.375C5.19607 9.375 6.875 7.69607 6.875 5.625H8.125C8.125 7.69607 9.80394 9.375 11.875 9.375V10.625C9.80394 10.625 8.125 12.3039 8.125 14.375H6.875C6.875 12.3039 5.19607 10.625 3.125 10.625V9.375ZM5.54751 10C6.36698 10.4548 7.04527 11.133 7.5 11.9525C7.95473 11.133 8.63302 10.4548 9.4525 10C8.63302 9.54525 7.95473 8.867 7.5 8.04751C7.04527 8.867 6.36698 9.54525 5.54751 10ZM13.2812 11.25C13.2812 12.3718 12.3718 13.2812 11.25 13.2812V14.2188C12.3718 14.2188 13.2812 15.1282 13.2812 16.25H14.2188C14.2188 15.1282 15.1282 14.2188 16.25 14.2188V13.2812C15.1282 13.2812 14.2188 12.3718 14.2188 11.25H13.2812Z"
          fill="#CBB26A"
        />
      </svg>
    ),
  },
  {
    name: "Durable Workflows",
    href: "/uses/durable-workflows?ref=nav",
    description: "Learn about durable workflows, retries, and more",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.5 8.5L17.5 5.5L14.5 2.5V4.75H11.9676C10.3425 4.75 8.97046 5.83337 8.5359 7.31697C9.06944 7.55859 9.53315 7.92729 9.8884 8.38446L9.8895 8.32809C9.8895 7.2229 10.7523 6.31922 11.841 6.25379L11.9676 6.25H14.5V8.5ZM9.88601 11.5149C9.80263 9.61273 8.23412 8.09618 6.3114 8.09618H2.5V9.59618H6.3114L6.43799 9.59998C7.52674 9.6654 8.3895 10.5691 8.3895 11.6743L8.39298 11.8337C8.47636 13.7358 10.0449 15.2524 11.9676 15.2524H14.5V17.5L17.5 14.5L14.5 11.5V13.7524H11.9676L11.841 13.7486C10.7522 13.6832 9.8895 12.7795 9.8895 11.6743L9.88601 11.5149Z"
          fill="#2C9B63"
        />
      </svg>
    ),
  },
  {
    name: "Durable Endpoints",
    href: "/durable-endpoints?ref=nav",
    description: "Build fault-tolerant API endpoints",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.1428 11.1665L8.26201 7.28575L9.44052 6.10724L15.3331 11.9998L9.44052 17.8923L8.26201 16.7138L12.1427 12.8331L4.49953 12.8332L4.49951 11.1666L12.1428 11.1665ZM16.9996 17.8331V6.16641H18.6663V17.8331H16.9996Z"
          fill="#AD8513"
        />
      </svg>
    ),
  },
  {
    name: "Platform",
    href: "/platform?ref=nav",
    description: "Learn about features, flow control, and more",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M5.875 9.625C5.43179 9.625 4.99292 9.5377 4.58344 9.36809C4.17397 9.19848 3.80191 8.94988 3.48851 8.63649C3.17512 8.32309 2.92652 7.95103 2.75691 7.54156C2.5873 7.13208 2.5 6.69321 2.5 6.25C2.5 5.80679 2.5873 5.36792 2.75691 4.95844C2.92652 4.54897 3.17512 4.17691 3.48851 3.86351C3.80191 3.55012 4.17397 3.30152 4.58344 3.13191C4.99292 2.9623 5.43179 2.875 5.875 2.875C6.77011 2.875 7.62855 3.23058 8.26149 3.86351C8.89442 4.49645 9.25 5.35489 9.25 6.25C9.25 7.14511 8.89442 8.00355 8.26149 8.63649C7.62855 9.26942 6.77011 9.625 5.875 9.625ZM6.25 17.125C5.35489 17.125 4.49645 16.7694 3.86351 16.1365C3.23058 15.5035 2.875 14.6451 2.875 13.75C2.875 12.8549 3.23058 11.9965 3.86351 11.3635C4.49645 10.7306 5.35489 10.375 6.25 10.375C7.14511 10.375 8.00355 10.7306 8.63649 11.3635C9.26942 11.9965 9.625 12.8549 9.625 13.75C9.625 14.6451 9.26942 15.5035 8.63649 16.1365C8.00355 16.7694 7.14511 17.125 6.25 17.125ZM13.75 9.625C13.3068 9.625 12.8679 9.5377 12.4584 9.36809C12.049 9.19848 11.6769 8.94988 11.3635 8.63649C11.0501 8.32309 10.8015 7.95103 10.6319 7.54156C10.4623 7.13208 10.375 6.69321 10.375 6.25C10.375 5.80679 10.4623 5.36792 10.6319 4.95844C10.8015 4.54897 11.0501 4.17691 11.3635 3.86351C11.6769 3.55012 12.049 3.30152 12.4584 3.13191C12.8679 2.9623 13.3068 2.875 13.75 2.875C14.6451 2.875 15.5035 3.23058 16.1365 3.86351C16.7694 4.49645 17.125 5.35489 17.125 6.25C17.125 7.14511 16.7694 8.00355 16.1365 8.63649C15.5035 9.26942 14.6451 9.625 13.75 9.625ZM13.75 17.125C12.8549 17.125 11.9965 16.7694 11.3635 16.1365C10.7306 15.5035 10.375 14.6451 10.375 13.75C10.375 12.8549 10.7306 11.9965 11.3635 11.3635C11.9965 10.7306 12.8549 10.375 13.75 10.375C14.6451 10.375 15.5035 10.7306 16.1365 11.3635C16.7694 11.9965 17.125 12.8549 17.125 13.75C17.125 14.6451 16.7694 15.5035 16.1365 16.1365C15.5035 16.7694 14.6451 17.125 13.75 17.125ZM5.875 8.125C6.37228 8.125 6.84919 7.92746 7.20083 7.57583C7.55246 7.22419 7.75 6.74728 7.75 6.25C7.75 5.75272 7.55246 5.27581 7.20083 4.92417C6.84919 4.57254 6.37228 4.375 5.875 4.375C5.37772 4.375 4.90081 4.57254 4.54917 4.92417C4.19754 5.27581 4 5.75272 4 6.25C4 6.74728 4.19754 7.22419 4.54917 7.57583C4.90081 7.92746 5.37772 8.125 5.875 8.125ZM6.25 15.625C6.74728 15.625 7.22419 15.4275 7.57583 15.0758C7.92746 14.7242 8.125 14.2473 8.125 13.75C8.125 13.2527 7.92746 12.7758 7.57583 12.4242C7.22419 12.0725 6.74728 11.875 6.25 11.875C5.75272 11.875 5.27581 12.0725 4.92417 12.4242C4.57254 12.7758 4.375 13.2527 4.375 13.75C4.375 14.2473 4.57254 14.7242 4.92417 15.0758C5.27581 15.4275 5.75272 15.625 6.25 15.625ZM13.75 8.125C14.2473 8.125 14.7242 7.92746 15.0758 7.57583C15.4275 7.22419 15.625 6.74728 15.625 6.25C15.625 5.75272 15.4275 5.27581 15.0758 4.92417C14.7242 4.57254 14.2473 4.375 13.75 4.375C13.2527 4.375 12.7758 4.57254 12.4242 4.92417C12.0725 5.27581 11.875 5.75272 11.875 6.25C11.875 6.74728 12.0725 7.22419 12.4242 7.57583C12.7758 7.92746 13.2527 8.125 13.75 8.125ZM13.75 15.625C14.2473 15.625 14.7242 15.4275 15.0758 15.0758C15.4275 14.7242 15.625 14.2473 15.625 13.75C15.625 13.2527 15.4275 12.7758 15.0758 12.4242C14.7242 12.0725 14.2473 11.875 13.75 11.875C13.2527 11.875 12.7758 12.0725 12.4242 12.4242C12.0725 12.7758 11.875 13.2527 11.875 13.75C11.875 14.2473 12.0725 14.7242 12.4242 15.0758C12.7758 15.4275 13.2527 15.625 13.75 15.625Z"
          fill="#8F75B7"
        />
      </svg>
    ),
  },
  {
    name: "Queueing",
    href: "/compare-to-legacy-queues?ref=nav",
    description: "Compare Inngest to legacy queues",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.75 5.625C14.0952 5.625 14.375 5.90482 14.375 6.25C14.375 6.59517 14.0952 6.875 13.75 6.875C13.4048 6.875 13.125 6.59517 13.125 6.25C13.125 5.90482 13.4048 5.625 13.75 5.625ZM15.625 6.25C15.625 5.21447 14.7855 4.375 13.75 4.375C12.9336 4.375 12.2391 4.89676 11.9817 5.625L8.01831 5.625C7.76094 4.89676 7.06637 4.375 6.25 4.375C5.21444 4.375 4.375 5.21447 4.375 6.25C4.375 7.28553 5.21444 8.125 6.25 8.125C7.06637 8.125 7.76094 7.60324 8.01831 6.875L11.9817 6.875C12.2391 7.60324 12.9336 8.125 13.75 8.125C14.7855 8.125 15.625 7.28553 15.625 6.25ZM6.25 5.625C6.59519 5.625 6.875 5.90482 6.875 6.25C6.875 6.59517 6.59519 6.875 6.25 6.875C5.90481 6.875 5.625 6.59517 5.625 6.25C5.625 5.90482 5.90481 5.625 6.25 5.625ZM6.875 13.75C6.875 13.4048 6.59519 13.125 6.25 13.125C5.90481 13.125 5.625 13.4048 5.625 13.75C5.625 14.0952 5.90481 14.375 6.25 14.375C6.59519 14.375 6.875 14.0952 6.875 13.75ZM6.25 11.875C7.28556 11.875 8.125 12.7144 8.125 13.75C8.125 14.7856 7.28556 15.625 6.25 15.625C5.21444 15.625 4.375 14.7856 4.375 13.75C4.375 12.7144 5.21444 11.875 6.25 11.875ZM12.8125 13.75C12.8125 14.2677 13.2322 14.6875 13.75 14.6875C14.2678 14.6875 14.6875 14.2677 14.6875 13.75C14.6875 13.2323 14.2678 12.8125 13.75 12.8125C13.2322 12.8125 12.8125 13.2323 12.8125 13.75ZM10.3125 14.6875C9.79475 14.6875 9.375 14.2677 9.375 13.75C9.375 13.2322 9.79475 12.8125 10.3125 12.8125C10.8302 12.8125 11.25 13.2323 11.25 13.75C11.25 14.2677 10.8302 14.6875 10.3125 14.6875Z"
          fill="#FF7300"
        />
      </svg>
    ),
  },
  {
    name: "Workflow Engines",
    href: "/uses/workflow-engine?ref=nav",
    description: "Learn about workflow engines",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M5.5 17.1249C4.05025 17.1249 2.875 15.9496 2.875 14.4999C2.875 13.0501 4.05025 11.8749 5.5 11.8749C6.68875 11.8749 7.693 12.6654 8.01625 13.7499H12.25V12.2499H13.75V7.93139L12.0677 6.24989H7.75V7.7499H3.25V3.24989H7.75V4.74989H12.0677L14.5 2.31689L17.6822 5.49989L15.25 7.93064V12.2499H16.75V16.7499H12.25V15.2499H8.01625C7.69375 16.3344 6.68875 17.1249 5.5 17.1249ZM5.5 13.3749C4.879 13.3749 4.375 13.8789 4.375 14.4999C4.375 15.1209 4.879 15.6249 5.5 15.6249C6.121 15.6249 6.625 15.1209 6.625 14.4999C6.625 13.8789 6.121 13.3749 5.5 13.3749ZM15.25 13.7499H13.75V15.2499H15.25V13.7499ZM14.5 4.43939L13.4395 5.49989L14.5 6.56039L15.5605 5.49989L14.5 4.43939ZM6.25 4.74989H4.75V6.24989H6.25V4.74989Z"
          fill="#2389F1"
        />
      </svg>
    ),
  },
  {
    name: "Background Jobs",
    href: "/uses/serverless-node-background-jobs?ref=nav",
    description: "Learn about background jobs",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M6.25005 6.19647L4.81699 7.62954L3.93311 6.74565L6.87505 3.80371L9.817 6.74565L8.93312 7.62954L7.50005 6.19647L7.50004 9.37507H6.25005L6.25005 6.19647ZM13.1251 8.43759C13.988 8.43759 14.6876 7.73804 14.6876 6.87509C14.6876 6.01215 13.988 5.31259 13.1251 5.31259C12.2621 5.31259 11.5626 6.01215 11.5626 6.87509C11.5626 7.73804 12.2621 8.43759 13.1251 8.43759ZM13.1251 9.68757C11.5717 9.68757 10.3126 8.42839 10.3126 6.87509C10.3126 5.32179 11.5717 4.06259 13.1251 4.06259C14.6784 4.06259 15.9376 5.32179 15.9376 6.87509C15.9376 8.42839 14.6784 9.68757 13.1251 9.68757ZM16.067 13.2545L15.1831 12.3706L13.7501 13.8037V10.6251H12.5001V13.8037L11.067 12.3706L10.1831 13.2545L13.1251 16.1964L16.067 13.2545ZM5.62505 14.3751H8.12504L8.12505 11.8751H5.62505V14.3751ZM8.75006 10.6251C9.09525 10.6251 9.37506 10.9049 9.37506 11.2501L9.37506 15.0001C9.37506 15.3453 9.09525 15.6251 8.75006 15.6251H5.00004C4.65487 15.6251 4.37504 15.3453 4.37505 15.0001L4.37505 11.2501C4.37505 10.9049 4.65487 10.6251 5.00005 10.6251H8.75006Z"
          fill="#EFE9D6"
        />
      </svg>
    ),
  },
  {
    name: "Scheduled and cron jobs",
    href: "/uses/serverless-cron-jobs?ref=nav",
    description: "Learn about scheduled and recurring jobs",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M10 2.5C14.1423 2.5 17.5 5.85775 17.5 10C17.5 14.1423 14.1423 17.5 10 17.5C5.85775 17.5 2.5 14.1423 2.5 10H4C4 13.3135 6.6865 16 10 16C13.3135 16 16 13.3135 16 10C16 6.6865 13.3135 4 10 4C7.9375 4 6.118 5.04025 5.03875 6.625L7 6.625V8.125H2.5L2.5 3.625H4V5.5C5.368 3.6775 7.54675 2.5 10 2.5ZM10.75 6.25L10.75 9.68875L13.1823 12.121L12.121 13.1823L9.25 10.3098V6.25L10.75 6.25Z"
          fill="#B17A50"
        />
      </svg>
    ),
  },
];

export default function PlatformPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center font-circular text-sm/6 font-semibold focus:outline-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span
            className={`${
              isOpen ? "border-b border-current" : "border-b border-transparent"
            } flex items-center`}
          >
            PLATFORM
            <ChevronDownIcon aria-hidden="true" className="size-4" />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
        className="mt-1 w-screen max-w-max rounded-none border border-stone-700 bg-stone-900 p-0 text-sm/6 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="mx-auto w-full max-w-md overflow-hidden lg:max-w-3xl">
          <div className="grid grid-cols-1 gap-y-1 lg:grid-cols-2 lg:gap-0">
            <div className="lg:pr-3">
              <div className="flex flex-col items-start gap-1 lg:pb-4">
                <h3 className="text-sm font-medium leading-6 text-stone-400">
                  Features
                </h3>
                <div className="mt-2 flow-root w-full">
                  <div className="-my-2">
                    {platformDropdown.slice(0, 4).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex gap-x-2 rounded-sm px-2 py-2 text-sm font-semibold leading-6 text-stone-50 transition-colors hover:bg-stone-800"
                      >
                        <div className="flex items-center gap-x-2">
                          {item.icon}
                          <div className="flex flex-col">
                            <span className="text-base text-stone-50">
                              {item.name}
                            </span>
                            <span className="text-xs font-normal text-stone-400">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:pl-3">
              <div className="flex flex-col items-start gap-1 pb-4">
                <h3 className="hidden text-sm font-medium leading-6 text-stone-400 lg:invisible lg:block">
                  Latest blog
                </h3>
                <div className="mt-2 flow-root w-full">
                  <div className="-my-2">
                    {platformDropdown.slice(4).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex gap-x-2 rounded-sm px-2 py-2 text-sm font-semibold leading-6 text-stone-50 transition-colors hover:bg-stone-800"
                      >
                        <div className="flex items-center gap-x-2">
                          {item.icon}
                          <div className="flex flex-col">
                            <span className="text-base text-stone-50">
                              {item.name}
                            </span>
                            <span className="text-xs font-normal text-stone-400">
                              {item.description}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
