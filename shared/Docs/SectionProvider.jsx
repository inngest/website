"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { createStore, useStore } from "zustand";

import { remToPx } from "../../utils/remToPx";

const PAGE_HEADER_OFFSET_REM = 4;

// type Section = { id: string; headingRef: any; offsetRem: string };
// type State = {
//   sections?: Section[];
//   visibleSections?: Section[];
//   setVisibleSections?: (sections: Section[]) => void;
//   registerHeading?: (Section) => void;
// };

function createSectionStore(sections) {
  return createStore((set) => ({
    sections,
    visibleSections: [],
    setVisibleSections: (visibleSections) =>
      set((state) =>
        state.visibleSections.join() === visibleSections.join()
          ? {}
          : { visibleSections }
      ),
    registerHeading: ({ id, ref, offsetRem }) =>
      set((state) => {
        return {
          sections: state.sections.map((section) => {
            if (section.id === id) {
              return {
                ...section,
                headingRef: ref,
                level: +(ref.current?.tagName.replace("H", "") ?? 0),
                offsetRem,
              };
            }
            return section;
          }),
        };
      }),
  }));
}

function useVisibleSections(sectionStore) {
  let setVisibleSections = useStore(sectionStore, (s) => s.setVisibleSections);
  let sections = useStore(sectionStore, (s) => s.sections);

  useEffect(() => {
    function checkVisibleSections() {
      let { innerHeight, scrollY, document } = window;
      let newVisibleSections = [];
      let topThreshold = 100; // px from top to determine "active" section

      // Check if we are at the bottom of the page
      if (
        innerHeight + Math.round(scrollY) >=
        document.body.offsetHeight - 10 // tolerance
      ) {
        if (sections.length > 0) {
          setVisibleSections([sections[sections.length - 1].id]);
          return;
        }
      }

      // Find the last section that is above the threshold
      let activeSection = sections[0]; // Default to first

      for (let i = 0; i < sections.length; i++) {
        let section = sections[i];
        let rect = section.headingRef?.current?.getBoundingClientRect();
        if (!rect) continue;

        // If this section's top is above the threshold, it's the current candidate.
        if (rect.top < topThreshold) {
          activeSection = section;
        } else {
          // This section starts below the threshold, so the previous candidate is the active one
          break;
        }
      }

      if (activeSection) {
        newVisibleSections.push(activeSection.id);
      }

      setVisibleSections(newVisibleSections);
    }

    let raf = window.requestAnimationFrame(() => checkVisibleSections());
    window.addEventListener("scroll", checkVisibleSections, { passive: true });
    window.addEventListener("resize", checkVisibleSections);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", checkVisibleSections);
      window.removeEventListener("resize", checkVisibleSections);
    };
  }, [setVisibleSections, sections]);
}

const SectionStoreContext = createContext();

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function SectionProvider({ sections, children }) {
  let [sectionStore] = useState(() => createSectionStore(sections));

  useVisibleSections(sectionStore);

  useIsomorphicLayoutEffect(() => {
    sectionStore.setState({ sections });
  }, [sectionStore, sections]);

  return (
    <SectionStoreContext.Provider value={sectionStore}>
      {children}
    </SectionStoreContext.Provider>
  );
}

export function useSectionStore(selector) {
  let store = useContext(SectionStoreContext);
  if (!store) {
    throw new Error("Include SectionProvider within your page component");
  }
  return useStore(store, selector);
}
