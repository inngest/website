"use client";
import LineWithGlow from "./LineWithGlow";
import { useFeatureNavigatePathsMedium } from "./useFeatureNavigatePathsMedium";

export default function MediumLines() {
  const { desktopLines, mobileLine } = useFeatureNavigatePathsMedium();

  return (
    <>
      {desktopLines.map((line, idx) => (
        <LineWithGlow
          key={`medium-${idx}`}
          path={line.path}
          dotPos={line.dotPos}
          index={idx}
          visibilityClass="hidden md:block xl:hidden"
          orientation="horizontal"
        />
      ))}

      {mobileLine && (
        <LineWithGlow
          key="medium-mobile-line"
          path={mobileLine.path}
          dotPos={mobileLine.dotPos}
          index={0}
          visibilityClass="hidden"
          orientation="vertical"
        />
      )}
    </>
  );
}
