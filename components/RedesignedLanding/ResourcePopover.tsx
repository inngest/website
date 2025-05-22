import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
export const resourceDropdown = [
  {
    name: "Blog",
    href: "#",
    description: "Read our latest articles",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 16V4H4V15.25C4 15.4489 4.07902 15.6397 4.21967 15.7803C4.36032 15.921 4.55109 16 4.75 16H13ZM15.25 17.5H4.75C4.15326 17.5 3.58097 17.2629 3.15901 16.841C2.73705 16.419 2.5 15.8467 2.5 15.25V3.25C2.5 3.05109 2.57902 2.86032 2.71967 2.71967C2.86032 2.57902 3.05109 2.5 3.25 2.5H13.75C13.9489 2.5 14.1397 2.57902 14.2803 2.71967C14.421 2.86032 14.5 3.05109 14.5 3.25V8.5H17.5V15.25C17.5 15.8467 17.2629 16.419 16.841 16.841C16.419 17.2629 15.8467 17.5 15.25 17.5ZM14.5 10V15.25C14.5 15.4489 14.579 15.6397 14.7197 15.7803C14.8603 15.921 15.0511 16 15.25 16C15.4489 16 15.6397 15.921 15.7803 15.7803C15.921 15.6397 16 15.4489 16 15.25V10H14.5ZM5.5 5.5H10V10H5.5V5.5ZM7 7V8.5H8.5V7H7ZM5.5 10.75H11.5V12.25H5.5V10.75ZM5.5 13H11.5V14.5H5.5V13Z"
          fill="#AD8513"
        />
      </svg>
    ),
  },
  {
    name: "Changelog",
    href: "#",
    description: "See what's new in Inngest",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.25 15V6.875L15 4.375H5L3.75 6.87721V15C3.75 15.3452 4.02983 15.625 4.375 15.625H15.625C15.9702 15.625 16.25 15.3452 16.25 15ZM5 8.125H15V14.375H5V8.125ZM5.7725 5.625H14.2275L14.8525 6.875H5.14812L5.7725 5.625ZM11.875 9.375H8.125V10.625H11.875V9.375Z"
          fill="#2C9B63"
        />
      </svg>
    ),
  },
  {
    name: "About",
    href: "#",
    description: "Learn more about Inngest",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 9.25C10.9946 9.25 11.9484 9.64509 12.6517 10.3483C13.3549 11.0516 13.75 12.0054 13.75 13V17.5H12.25V13C12.25 12.4261 12.0308 11.8739 11.637 11.4563C11.2433 11.0387 10.7049 10.7874 10.132 10.7537L10 10.75C9.42609 10.75 8.87386 10.9692 8.4563 11.363C8.03874 11.7567 7.78742 12.2951 7.75375 12.868L7.75 13V17.5H6.25V13C6.25 12.0054 6.64509 11.0516 7.34835 10.3483C8.05161 9.64509 9.00544 9.25 10 9.25ZM5.125 11.5C5.33425 11.5 5.5375 11.5247 5.7325 11.5705C5.60427 11.9523 5.52833 12.3496 5.50675 12.7517L5.5 13V13.0645C5.41379 13.0337 5.32412 13.0135 5.233 13.0045L5.125 13C4.84534 13 4.57571 13.1042 4.36869 13.2922C4.16166 13.4802 4.0321 13.7386 4.00525 14.017L4 14.125V17.5H2.5V14.125C2.5 13.4288 2.77656 12.7611 3.26884 12.2688C3.76113 11.7766 4.42881 11.5 5.125 11.5ZM14.875 11.5C15.5712 11.5 16.2389 11.7766 16.7312 12.2688C17.2234 12.7611 17.5 13.4288 17.5 14.125V17.5H16V14.125C16 13.8453 15.8958 13.5757 15.7078 13.3687C15.5198 13.1617 15.2614 13.0321 14.983 13.0052L14.875 13C14.7437 13 14.6178 13.0225 14.5 13.0637V13C14.5 12.5005 14.419 12.0205 14.2682 11.572C14.4625 11.5247 14.6657 11.5 14.875 11.5ZM5.125 7C5.62228 7 6.09919 7.19754 6.45083 7.54917C6.80246 7.90081 7 8.37772 7 8.875C7 9.37228 6.80246 9.84919 6.45083 10.2008C6.09919 10.5525 5.62228 10.75 5.125 10.75C4.62772 10.75 4.15081 10.5525 3.79917 10.2008C3.44754 9.84919 3.25 9.37228 3.25 8.875C3.25 8.37772 3.44754 7.90081 3.79917 7.54917C4.15081 7.19754 4.62772 7 5.125 7ZM14.875 7C15.3723 7 15.8492 7.19754 16.2008 7.54917C16.5525 7.90081 16.75 8.37772 16.75 8.875C16.75 9.37228 16.5525 9.84919 16.2008 10.2008C15.8492 10.5525 15.3723 10.75 14.875 10.75C14.3777 10.75 13.9008 10.5525 13.5492 10.2008C13.1975 9.84919 13 9.37228 13 8.875C13 8.37772 13.1975 7.90081 13.5492 7.54917C13.9008 7.19754 14.3777 7 14.875 7ZM5.125 8.5C5.02554 8.5 4.93016 8.53951 4.85984 8.60983C4.78951 8.68016 4.75 8.77554 4.75 8.875C4.75 8.97446 4.78951 9.06984 4.85984 9.14017C4.93016 9.21049 5.02554 9.25 5.125 9.25C5.22446 9.25 5.31984 9.21049 5.39016 9.14017C5.46049 9.06984 5.5 8.97446 5.5 8.875C5.5 8.77554 5.46049 8.68016 5.39016 8.60983C5.31984 8.53951 5.22446 8.5 5.125 8.5ZM14.875 8.5C14.7755 8.5 14.6802 8.53951 14.6098 8.60983C14.5395 8.68016 14.5 8.77554 14.5 8.875C14.5 8.97446 14.5395 9.06984 14.6098 9.14017C14.6802 9.21049 14.7755 9.25 14.875 9.25C14.9745 9.25 15.0698 9.21049 15.1402 9.14017C15.2105 9.06984 15.25 8.97446 15.25 8.875C15.25 8.77554 15.2105 8.68016 15.1402 8.60983C15.0698 8.53951 14.9745 8.5 14.875 8.5ZM10 2.5C10.7956 2.5 11.5587 2.81607 12.1213 3.37868C12.6839 3.94129 13 4.70435 13 5.5C13 6.29565 12.6839 7.05871 12.1213 7.62132C11.5587 8.18393 10.7956 8.5 10 8.5C9.20435 8.5 8.44129 8.18393 7.87868 7.62132C7.31607 7.05871 7 6.29565 7 5.5C7 4.70435 7.31607 3.94129 7.87868 3.37868C8.44129 2.81607 9.20435 2.5 10 2.5ZM10 4C9.60218 4 9.22064 4.15804 8.93934 4.43934C8.65804 4.72064 8.5 5.10218 8.5 5.5C8.5 5.89782 8.65804 6.27936 8.93934 6.56066C9.22064 6.84196 9.60218 7 10 7C10.3978 7 10.7794 6.84196 11.0607 6.56066C11.342 6.27936 11.5 5.89782 11.5 5.5C11.5 5.10218 11.342 4.72064 11.0607 4.43934C10.7794 4.15804 10.3978 4 10 4Z"
          fill="#FF7300"
        />
      </svg>
    ),
  },
  {
    name: "Support",
    href: "#",
    description: "Get help from the Inngest team",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 17.5C5.85775 17.5 2.5 14.1423 2.5 10C2.5 5.85775 5.85775 2.5 10 2.5C14.1423 2.5 17.5 5.85775 17.5 10C17.5 14.1423 14.1423 17.5 10 17.5ZM10 16C11.5913 16 13.1174 15.3679 14.2426 14.2426C15.3679 13.1174 16 11.5913 16 10C16 8.4087 15.3679 6.88258 14.2426 5.75736C13.1174 4.63214 11.5913 4 10 4C8.4087 4 6.88258 4.63214 5.75736 5.75736C4.63214 6.88258 4 8.4087 4 10C4 11.5913 4.63214 13.1174 5.75736 14.2426C6.88258 15.3679 8.4087 16 10 16ZM9.25 12.25H10.75V13.75H9.25V12.25ZM10.75 11.0162V11.5H9.25V10.375C9.25 10.1761 9.32902 9.98532 9.46967 9.84467C9.61032 9.70402 9.80109 9.625 10 9.625C10.2131 9.62499 10.4217 9.56447 10.6017 9.4505C10.7818 9.33652 10.9257 9.17377 11.0168 8.98119C11.108 8.7886 11.1425 8.5741 11.1165 8.36263C11.0905 8.15117 11.005 7.95144 10.8699 7.78668C10.7348 7.62193 10.5557 7.49892 10.3534 7.43198C10.1511 7.36503 9.93403 7.3569 9.72732 7.40853C9.52061 7.46016 9.33281 7.56942 9.18577 7.72361C9.03874 7.8778 8.93851 8.07057 8.89675 8.2795L7.42525 7.98475C7.51647 7.52881 7.72713 7.10528 8.03569 6.75744C8.34425 6.4096 8.73964 6.14994 9.18144 6.00499C9.62325 5.86004 10.0956 5.83501 10.5503 5.93246C11.0049 6.02991 11.4255 6.24634 11.7691 6.55962C12.1127 6.8729 12.3669 7.2718 12.5058 7.71555C12.6447 8.15929 12.6633 8.63196 12.5596 9.08523C12.456 9.5385 12.2338 9.95612 11.9159 10.2954C11.5979 10.6347 11.1956 10.8834 10.75 11.0162Z"
          fill="#8F75B7"
        />
      </svg>
    ),
  },
];

export default function ResourcePopover() {
  return (
    <Popover className="relative">
      <PopoverButton className="inline-flex items-center font-circular text-sm/6 font-semibold">
        {({ open }) => (
          <>
            <span className={`${open ? "border-b border-current" : ""}`}>
              RESOURCES
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
                <div className="mt-2 flow-root w-full">
                  <div className="-my-2">
                    {resourceDropdown.map((item) => (
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
                <h3 className="text-sm font-medium leading-6 text-stone-400">
                  What's new
                </h3>
                <div className="mt-2 flow-root w-full">
                  <div className="-my-2">
                    <article className="relative isolate p-2 hover:bg-stone-800">
                      <div className="max-h-[120px]">
                        <img
                          alt=""
                          src="/assets/blog/announcing-realtime/featured-image.png"
                          className="h-32 w-full rounded-md object-cover"
                        />
                      </div>
                      <div className="max-w-[240px]">
                        <h4 className="mt-2 text-base text-stone-50">
                          <Link
                            href="#"
                            className="font-whyte text-base font-semibold leading-[1.05rem] text-stone-50"
                          >
                            <span className="absolute inset-0" />
                            Boost your conversion rate
                          </Link>
                        </h4>
                        <p className="mt-2 line-clamp-2 font-circular text-xs font-normal text-stone-400">
                          Et et dolore officia quis nostrud esse aute cillum
                          irure do esse.
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
