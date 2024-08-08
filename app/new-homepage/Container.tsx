import clsx from "clsx";
export default function Container({ className = "", children }) {
  return (
    <div className={clsx("mx-auto max-w-7xl px-2 md:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
