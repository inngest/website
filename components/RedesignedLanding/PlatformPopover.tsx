import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export const platformDropdown = [
  {
    name: "AI & Agents",
    href: "#",
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
    name: "Orchestration",
    href: "#",
    description: "Orchestrate your workflows with Inngest",
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
    name: "Monitoring",
    href: "#",
    description: "Monitor your Inngest functions",
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
    name: "Recovery",
    href: "#",
    description: "Recover from failures with Inngest",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 1.75C13.414 1.75 13.75 2.086 13.75 2.5V4.75H16.75C17.164 4.75 17.5 5.086 17.5 5.5V16C17.5 16.414 17.164 16.75 16.75 16.75H3.25C2.836 16.75 2.5 16.414 2.5 16V5.5C2.5 5.086 2.836 4.75 3.25 4.75H6.25V2.5C6.25 2.086 6.586 1.75 7 1.75H13ZM16 6.25H4V15.25H16V6.25ZM10.75 7.75V10H13V11.5H10.7492L10.75 13.75H9.25L9.24925 11.5H7V10H9.25V7.75H10.75ZM12.25 3.25H7.75V4.75H12.25V3.25Z"
          fill="#8F75B7"
        />
      </svg>
    ),
  },
];

export default function PlatformPopover() {
  return (
    <Popover className="relative">
      <PopoverButton className="inline-flex items-center font-circular text-sm/6 font-semibold">
        {({ open }) => (
          <>
            <span className={`${open ? "border-b border-current" : ""}`}>
              PLATFORM
            </span>
            <ChevronDownIcon aria-hidden="true" className="size-4" />
          </>
        )}
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute left-0 z-10 mt-5 w-screen max-w-max origin-top-left transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="mx-auto w-full max-w-md overflow-hidden border border-stone-700 bg-stone-900 text-sm/6 shadow-lg ring-1 ring-gray-900/5 lg:max-w-3xl">
          <div className="grid grid-cols-1 gap-y-1 p-4 lg:grid-cols-2 lg:gap-0">
            <div className="lg:border-r lg:border-stone-700 lg:pr-3">
              <div className="flex flex-col items-start gap-1 pb-4">
                <h3 className="text-sm font-medium leading-6 text-stone-400">
                  Features
                </h3>
                <div className="mt-2 flow-root">
                  <div className="-my-2 ">
                    {platformDropdown.map((item) => (
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
            <div className=" lg:pl-3">
              <div className="flex flex-col items-start gap-1 pb-4">
                <h3 className="text-sm font-medium leading-6 text-stone-400">
                  What's new
                </h3>
                <div className="mt-2 flow-root">
                  <div className="-my-2">
                    <article className="relative isolate flex flex-col gap-y-3 p-2 hover:bg-stone-800">
                      <div className="relative flex-none">
                        <img
                          alt=""
                          src="/assets/blog/announcing-realtime/featured-image.png"
                          className="aspect-[2/1] max-h-32  bg-gray-100 object-cover"
                        />

                        <div className="absolute inset-0 ring-1 ring-inset ring-gray-900/10" />
                      </div>
                      <div>
                        <h4 className="mt-2 text-base  text-stone-50">
                          <Link
                            href="#"
                            className="font-whyte text-base font-semibold leading-[1.05rem] text-stone-50"
                          >
                            <span className="absolute inset-0" />
                            Boost your conversion rate
                          </Link>
                        </h4>
                        <p className="mt-2 max-w-[30ch] break-words text-xs text-stone-400">
                          Et et dolore officia quis nostrud esse aute cillum
                          irure do esse. Eiusmod ad deserunt cupidatat est magna
                          Lorem.
                        </p>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  );
}
