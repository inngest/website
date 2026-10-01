/**
 * Group 1 from Desktop - 7 (505:2212).
 * 1320×637 at page x = -9. Starts 159px before the DX module
 * ends so the slab sits behind the video, not below it.
 */
export default function BluePixelBand() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/v1/home/figma-blue-band.png"
      alt=""
      width={1311}
      height={638}
      aria-hidden="true"
      className="pointer-events-none absolute left-[-24px] top-[calc(100%-5rem)] z-0 hidden h-[637px] w-[1320px] max-w-none object-cover object-left sm:left-[-40px] lg:left-[-2rem] lg:top-[calc(100%-159px)] lg:block"
    />
  );
}
