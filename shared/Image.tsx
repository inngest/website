
type ImageProps = {
  src: string;
  caption?: string;
};

export default function Image({
  src,
  caption
}: ImageProps) {
  return (
    <div className="mb-4">
      <img src={src} alt={caption} className="mb-0" />
      {
        caption && (
          <p className="text-sm text-center italic mt-1 mb-0">{caption}</p>
        )
      }
    </div>
  )
}
