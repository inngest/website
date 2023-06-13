import Image from "next/image";
import clsx from "clsx";
import classNames from "src/utils/classNames";

const MeshGradient = `
radial-gradient(at 21% 4%, hsla(209,94%,39%,0.69) 0px, transparent 50%),
radial-gradient(at 97% 96%, hsla(279,100%,76%,0.53) 0px, transparent 50%),
radial-gradient(at 43% 61%, hsla(279,100%,76%,0.53) 0px, transparent 50%),
radial-gradient(at 73% 24%, hsla(279,100%,76%,0.7) 0px, transparent 50%),
radial-gradient(at 5% 94%, hsla(210,75%,64%,0.81) 0px, transparent 50%),
url(/assets/textures/wave.svg)
`;

export default function CustomerQuote({
  quote,
  avatar,
  className,
  name,
}: {
  quote: string;
  name: string;
  className?: string;
  avatar?: string;
}) {
  return (
    <aside
      className={clsx(
        "py-5",
        className,
        !className?.match(/absolute/) && "relative"
      )}
    >
      <div className="absolute top-0 z-0 w-full h-full rounded-[14px] backdrop-blur bg-white/5"></div>
      <div
        className="relative z-10 mx-5 py-5 px-8 flex flex-col items-start gap-2 rounded-lg border border-white/10"
        style={{
          backgroundColor: `hsla(235,79%,63%,1)`,
          backgroundImage: MeshGradient,
        }}
      >
        <div className="text-lg text-white drop-shadow font-medium">
          &ldquo;{quote}&rdquo;
        </div>
        <div className="flex flex-row gap-4 items-center text-base font-medium text-indigo-50 drop-shadow">
          {avatar && (
            <Image
              src={avatar}
              alt={`Image of ${name}`}
              height={36}
              width={36}
              className="rounded-full"
            />
          )}
          {name}
        </div>
      </div>
    </aside>
  );
}
