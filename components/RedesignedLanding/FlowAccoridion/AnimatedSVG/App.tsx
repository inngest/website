import { useEffect, useRef, useState } from "react";
import Frame1321318587 from "./imports/Frame1321318587";

// Utility hook: returns a ref and the scale factor needed to fit `designWidth`
// into the current element width (keeps aspect ratio automatically because the
// wrapper already enforces the correct height via Tailwind's aspect-ratio util).
function useScaleToFit(designWidth: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!ref.current) return;

    const update = () => {
      const width = ref.current!.getBoundingClientRect().width;
      setScale(width / designWidth);
    };

    // Observe width changes with ResizeObserver (covers window resize, flex box
    // reflows, sidebar toggles, etc.).
    const ro = new ResizeObserver(update);
    ro.observe(ref.current);
    update();

    return () => ro.disconnect();
  }, [designWidth]);

  return { ref, scale } as const;
}

export default function TestAnimation() {
  // The animation artboard is 940 px wide by design.
  const { ref, scale } = useScaleToFit(940);

  return (
    <div ref={ref} className="relative aspect-[940/562] w-full">
      <div
        className="absolute inset-0 origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        <Frame1321318587 />
      </div>
    </div>
  );
}
