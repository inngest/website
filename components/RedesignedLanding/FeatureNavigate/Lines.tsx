"use client";
import LineWithGlow from "./LineWithGlow";
import { useFeatureNavigatePaths } from "./useFeatureNavigatePaths";

export default function Lines() {
  const { desktopLines, mobileLine } = useFeatureNavigatePaths();

  return (
    <>
      {desktopLines.map((line, idx) => (
        <LineWithGlow
          key={`desktop-${idx}`}
          path={line.path}
          dotPos={line.dotPos}
          index={idx}
          visibilityClass="hidden xl:block"
          orientation="horizontal"
        />
      ))}

      {mobileLine && (
        <LineWithGlow
          key="mobile-line"
          path={mobileLine.path}
          dotPos={mobileLine.dotPos}
          index={0}
          visibilityClass="block sm:hidden"
          orientation="vertical"
        />
      )}
    </>
  );
}
