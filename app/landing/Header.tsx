export default function Header({ children }) {
  return (
    <header
      /* .header class used for tailwind prose override (see typography.js) */
      className={`
      header
      relative mb-24
      flex flex-col items-center text-center justify-center
    `}
    >
      <div
        className={`
        absolute z-10 w-[calc(100%+100px)] md:w-[calc(100%+200px)] lg:w-[calc(100%+400px)]
        h-[400px]
        bg-[url(/assets/textures/blob-background-2.png)]
        bg-cover bg-no-repeat bg-bottom
      `}
      ></div>
      <div className="relative py-32 z-20 text-carbon-50 font-regular">
        {children}
      </div>
    </header>
  );
}
