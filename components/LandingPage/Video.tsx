export default function Video({ src }: { src: string }) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      className={`
        mt-14 mx-auto w-full max-w-6xl
        rounded-lg scale-80 origin-center
        pointer-events-none
        border border-subtle
        shadow-[0_0_220px_16px_rgba(20,284,286,0.2)]
      `}
    />
  );
}
