import { ComponentType } from "react";
import clsx from "clsx";

type TabItem = {
  title: string;
  icon?: any; // TODO
};

export function Tabs<T extends TabItem>({
  content,
  setSelected,
  selected,
}: {
  content: T[];
  setSelected: (idx: number) => void;
  selected: number;
}) {
  return (
    <div
      className={`relative grid grid-cols-${content.length / 2} sm:grid-cols-${
        content.length
      } justify-stretch gap-y-2`}
    >
      {content.map(({ title, ...tab }, idx) => (
        <Tab
          key={idx}
          isSelected={selected === idx}
          onClick={() => setSelected(idx)}
        >
          {tab.icon && (
            <tab.icon className="h-4 w-4 fill-[#1CB4D5] md:h-6 md:w-6" />
          )}
          {title}
        </Tab>
      ))}
      <div
        className={clsx(
          `absolute -bottom-px left-0 w-1/${content.length} h-0.5`,
          `bg-inngestLux`,
          `transform transition-transform duration-300`
        )}
        style={{
          transform: `translateX(${selected * 100}%)`,
        }}
      ></div>
    </div>
  );
}

export function Tab({ isSelected = false, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `-mb-px flex grow flex-row items-center justify-center gap-2 whitespace-nowrap p-2 sm:p-4 `,
        `font-semibold transition-all`,
        isSelected
          ? "border-[#1CB4D5] text-basis"
          : "border-transparent text-muted hover:text-basis"
      )}
    >
      {children}
    </button>
  );
}
