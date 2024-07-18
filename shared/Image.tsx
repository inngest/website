
type ImageProps = {
  src: string;
  caption?: string;
};

export default function Image({
  src,
  caption
}: ImageProps) {
  return (
    <fig>
      <img src={src} alt={caption} className="mb-0" />
      {
        caption && (
          <figcaption className="text-sm text-center italic">{caption}</figcaption>
        )
      }
    </fig>
  )
}
