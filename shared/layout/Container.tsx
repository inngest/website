export default function Container({ children, className = "", style = {} }) {
  return (
    <div
      className={`relative z-10 m-auto px-6 md:px-10 lg:px-20 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
