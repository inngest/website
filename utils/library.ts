import cachedData from "../public/json/library.json";

export type LibraryItem = {
  dir: string;
  config: {
    name: string;
    description: string;
    why: string;
    categories: string[];
    features: string[];
    template: string;
  };
};

export type LibraryData = LibraryItem[];

class LibraryManager {
  _library: LibraryData;

  constructor(data: LibraryData) {
    this._library = data;
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
  return new LibraryManager(data);
};
