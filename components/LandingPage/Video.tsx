export default function Video({ src }: { src: string }) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      className={`
        scale-80 pointer-events-none mx-auto mt-14
        w-full max-w-6xl origin-center
        rounded-lg
        border border-subtle
      `}
    />
  );
}
