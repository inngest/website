import Image from "next/image";
import clsx from "clsx";

const MeshGradient = `
radial-gradient(at 21% 4%, hsla(209,94%,39%,0.69) 0px, transparent 50%),
radial-gradient(at 97% 96%, hsla(279,100%,76%,0.53) 0px, transparent 50%),
radial-gradient(at 43% 61%, hsla(279,100%,76%,0.53) 0px, transparent 50%),
radial-gradient(at 73% 24%, hsla(279,100%,76%,0.7) 0px, transparent 50%),
radial-gradient(at 5% 94%, hsla(210,75%,64%,0.81) 0px, transparent 50%),
url(/assets/textures/wave.svg)
`;

const MeshGradientLight = `
radial-gradient(at 21% 4%, hsla(209,94%,39%,0.07) 0px, transparent 50%),
radial-gradient(at 97% 96%, hsla(279,100%,76%,0.053) 0px, transparent 50%),
radial-gradient(at 43% 61%, hsla(279,100%,76%,0.053) 0px, transparent 50%),
radial-gradient(at 73% 24%, hsla(279,100%,76%,0.07) 0px, transparent 50%),
radial-gradient(at 5% 94%, hsla(210,75%,64%,0.081) 0px, transparent 50%),
url(/assets/textures/wave.svg)
`;

export default function CustomerQuote({
  quote,
  avatar,
  className,
  variant = "dark",
  name,
}: {
  quote: string;
  name: string;
  className?: string;
  variant?: "dark" | "light";
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
      <div
        className={clsx(
          "absolute top-0 z-0 w-full h-full rounded-[14px] backdrop-blur bg-white/5",
          variant === "dark" && "bg-white/5",
          variant === "light" && "bg-slate-100/50"
        )}
      ></div>
      <div
        className="relative z-10 mx-5 py-5 px-8 flex flex-col items-start gap-2 rounded-lg border border-white/10"
        style={{
          backgroundColor:
            variant === "dark"
              ? `hsla(235,79%,63%,1)`
              : "hsla(235,79%,63%,0.2)",
          backgroundImage:
            variant === "dark" ? MeshGradient : MeshGradientLight,
        }}
      >
        <div
          className={clsx(
            "text-lg font-medium",
            variant === "dark" ? "text-white drop-shadow" : "text-slate-900"
          )}
        >
          &ldquo;{quote}&rdquo;
        </div>
        <div
          className={clsx(
            "flex flex-row gap-4 items-center text-base font-medium",
            avatar && variant === "dark"
              ? "text-indigo-50 drop-shadow"
              : "text-slate-800"
          )}
        >
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
