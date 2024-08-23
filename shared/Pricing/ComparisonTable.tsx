import Link from "next/link";
import {
  RiExternalLinkLine,
  RiCloseCircleFill,
  RiCheckboxCircleFill,
} from "@remixicon/react";

export default function ComparisonTable({ plans, features, sections }) {
  return (
    <div className="text-basis">
      <h2 className="mt-4 text-2xl font-semibold">Plan features</h2>
      {sections.map((section) => {
        const sectionFeatures = features.filter(
          (feature) => feature.section === section.key
        );
        if (section.key === "recovery") {
          return renderHighlightGrid(
            sectionFeatures,
            section.name,
            section.description
          );
        }
        return sectionFeatures.length > 0
          ? renderTable(sectionFeatures, section.name, plans)
          : null;
      })}
    </div>
  );
}

const renderTable = (sectionFeatures, sectionName, plans) => (
  <table className="w-full table-fixed my-8 text-left">
    <thead>
      {/* Sticky header height */}
      <tr className="border-b border-muted md:sticky top-[84px] bg-canvasBase">
        <th className="py-4 text-lg font-bold">{sectionName}</th>
        {plans.map((plan, i) => (
          <th className="px-6 py-4" key={i}>
            <h2 className="text-sm font-medium">{plan.name} </h2>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {sectionFeatures.map((feature, i) => (
        <tr key={i} className="h-11 border-t border-subtle">
          <td className="h-14 text-sm">
            <div className="flex items-center font-medium gap-1">
              {feature.name}
              {Boolean(feature.infoUrl) && (
                <Link
                  href={feature.infoUrl}
                  className="transition-all text-muted hover:text-white"
                >
                  <RiExternalLinkLine className="h-4 w-4" />
                </Link>
              )}
            </div>
            {feature.description && (
              <div className="text-muted mt-0.5">{feature.description}</div>
            )}
          </td>
          {plans.map((plan, j) => {
            const value =
              typeof feature.plans?.[plan.name] === "string"
                ? feature.plans?.[plan.name]
                : typeof feature.all === "string"
                ? feature.all
                : null;
            const bool =
              typeof feature.plans?.[plan.name] === "boolean"
                ? feature.plans?.[plan.name]
                : typeof feature.all === "boolean"
                ? feature.all
                : null;

            return typeof value === "string" ? (
              <td key={j} className="px-6 text-sm font-medium">
                {value}
              </td>
            ) : (
              <td className="px-6" key={j}>
                {bool ? (
                  <RiCheckboxCircleFill className="text-primary-xSubtle h-5 w-5" />
                ) : (
                  <RiCloseCircleFill className="text-disabled h-5 w-5" />
                )}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);

const renderHighlightGrid = (
  sectionFeatures,
  sectionName,
  sectionDescription
) => (
  <div className="w-full my-8 text-center bg-gradient-to-b from-matcha-400 to-breeze-400 rounded-2xl p-px">
    <div className="bg-canvasBase px-6 py-8 rounded-2xl">
      <div className="pb-6 text-lg font-bold">
        {sectionName}
        <div className="text-sm font-normal">{sectionDescription}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 text-sm gap-6 lg:gap-10">
        {sectionFeatures.map((feature, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="flex items-center font-medium gap-1">
              {feature.name}
              {Boolean(feature.infoUrl) && (
                <Link
                  href={feature.infoUrl}
                  className="transition-all text-muted hover:text-white"
                >
                  <RiExternalLinkLine className="h-4 w-4" />
                </Link>
              )}
            </div>
            {feature.description && (
              <div className="text-muted mt-0.5">{feature.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);
