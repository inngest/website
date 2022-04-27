import cachedData from "../public/json/library.json";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export type LibraryItem = {
  dir: string;
  config: {
    name: string;
    description: string;
    why: string;
    when: string;
    run: string;
    categories: string[];
    features: string[];
    template: string;

    md?: {
      description: MDXRemoteSerializeResult;
      when: MDXRemoteSerializeResult;
      why: MDXRemoteSerializeResult;
      run: MDXRemoteSerializeResult;
    }
  };
};

export type LibraryData = LibraryItem[];

class LibraryManager {
  _library: LibraryData;

  constructor(data: LibraryData) {
    this._library = data;
  }

  async process(): Promise<any> {
    const results = await this.markdownify();
    console.log(results);
  }

  async markdownify(): Promise<any> {
    // Markdowi-ify the content.
    for (let i = 0; i < this._library.length; i++) {
      const item = this._library[i];
      const md = {
        description: await serialize(item.config.description),
        why: await serialize(item.config.description),
        when: await serialize(item.config.when),
        run: await serialize(item.config.run),
      };
      this._library[i].config.md = md;
    }
  }

  get library() {
    return this._library;
  }

  forCategory = (c: string): LibraryData => {
    return this._library.filter(l => l.config.categories.includes(c));
  }
}

export default async (): Promise<LibraryManager> => {
  if (process.env.NODE_ENV === "production") {
    return new LibraryManager(cachedData);
  }

  // Fetch the library JSON file
  const results = await fetch("https://github.com/inngest/library/releases/latest/download/library.json")
  const data = await results.json();
  const lm = new LibraryManager(data);
  await lm.markdownify();
  return lm
};
