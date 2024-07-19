"use client";
import { useState, useEffect } from "react";

type LinkCardProps = {
  href: string;
  text?: string;
};

type Description = {
  title?: string;
  text?: string;
  img?: string;
}

const findTitle = (doc: HTMLDocument): string | null => {
  const tag = doc.querySelector('head > meta[property="og:title"]');
  if (tag === null) return null;
  const title = tag.getAttribute("content");
  console.log(title);
  return title;
}

const findThumbNail = (doc: HTMLDocument): string | null => {
  const tag = doc.querySelector('head > meta[property="og:image"]');
  if (tag === null) return null;
  const src = tag.getAttribute("content");
  return src;
}

const findDesc = (doc: HTMLDocument): string | null => {
  const tag = doc.querySelector('head > meta[name="description"]');
  if (tag === null) return null;
  const desc = tag.getAttribute("content");
  return desc;
}

const fetchLinkDesc = async (link: string): Promise<Description> => {
  return await fetch(link)
    .then(async (resp) => {
      const html = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const title = findTitle(doc);
      const img = findThumbNail(doc);
      const text = findDesc(doc);

      return { title, img, text };
  })
}

const isDescEmpty = (desc: Description): boolean => {
  return desc.title === null && desc.img === null && desc.text === null;
}

export default function LinkCard({
  href,
  text
}: LinkCardProps) {
  const [desc, setDesc] = useState<Description>({text: text})

  useEffect(() => {
    (async function () {
      const desc = await fetchLinkDesc(href);
      setDesc(desc);
    })();
  }, []);

  if (isDescEmpty(desc)) return null;

  return (
    <a href={href} className="flex md:flex-row-reverse border rounded-lg shadow md:flex-row hover:bg-slate-900 w-full h-40" target="_blank">
      <img src={desc.img} alt={desc.text} className="object-cover hidden md:inline-block rounded-t-lg md:h-audo md:rounded-none md:rounded-r-lg m-0 md:w-1/3" />

      <div className="p-2 md:p-4 leading-normal md:w-2/3 flex flex-col justify-between">
        <div>
        { desc.title && <p className="mt-0 mb-2">{ desc.title }</p> }
        { desc.text && <p className="text-sm m-0">{ desc.text }</p> }
        </div>
        <small className="text-xs">{ href }</small>
      </div>
    </a>
  )
}
