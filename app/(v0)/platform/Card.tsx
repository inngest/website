export default function Card({ title, img }: { title?: string; img: string }) {
  return (
    <div>
      <img src={img} className="rounded-md bg-slate-300 w-full" />
      {title && <p className="mt-4 text-body text-lg text-center">{title}</p>}
    </div>
  );
}
