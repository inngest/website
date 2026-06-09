import fs from "node:fs";
import path from "node:path";
import { cache, type ImgHTMLAttributes } from "react";
import Image from "next/image";

function readImageDimensions(filePath: string) {
  const buffer = fs.readFileSync(filePath);

  if (buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }

      const marker = buffer[offset + 1];
      if (marker === 0xda || marker === 0xd9) break;

      const length = buffer.readUInt16BE(offset + 2);
      if (
        marker !== undefined &&
        ((marker >= 0xc0 && marker <= 0xc3) ||
          (marker >= 0xc5 && marker <= 0xc7) ||
          (marker >= 0xc9 && marker <= 0xcb) ||
          (marker >= 0xcd && marker <= 0xcf))
      ) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }

      offset += 2 + length;
    }
  }

  if (
    buffer.subarray(0, 6).toString("ascii") === "GIF87a" ||
    buffer.subarray(0, 6).toString("ascii") === "GIF89a"
  ) {
    return {
      width: buffer.readUInt16LE(6),
      height: buffer.readUInt16LE(8),
    };
  }

  return null;
}

const getLocalImageDimensions = cache((src: string) => {
  const pathname = decodeURIComponent(src.split(/[?#]/)[0] ?? "");
  if (!pathname.startsWith("/")) return null;

  const publicDir = path.join(process.cwd(), "public");
  const filePath = path.resolve(publicDir, pathname.slice(1));
  if (
    filePath !== publicDir &&
    (!filePath.startsWith(`${publicDir}${path.sep}`) ||
      !fs.existsSync(filePath))
  ) {
    return null;
  }

  try {
    return readImageDimensions(filePath);
  } catch {
    return null;
  }
});

export function MdxImage({
  alt = "",
  className,
  height: _height,
  loading,
  src,
  title,
  width: _width,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  if (typeof src !== "string") return null;

  const dimensions = getLocalImageDimensions(src);
  if (!dimensions) {
    return (
      <img
        {...props}
        alt={alt}
        className={className}
        decoding="async"
        loading={loading ?? "lazy"}
        src={src}
        title={title}
      />
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      height={dimensions.height}
      loading={loading}
      sizes="(min-width: 848px) 744px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 48px)"
      src={src}
      title={title}
      width={dimensions.width}
      quality={95}
    />
  );
}
