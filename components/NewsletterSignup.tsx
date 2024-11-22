"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

export default function NewsletterSignup({
  showHeader = true,
  buttonText = "Submit",
  tags = [],
  tagsFromSearchParams = false,
  // NOTE - Custom fields must be set up in mailchimp first that match the "name"
  fields = [],
}: {
  showHeader?: boolean;
  buttonText?: string;
  tags?: string[];
  tagsFromSearchParams?: boolean;
  fields?: { name: string; label: string }[];
}) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    error: string;
    result: boolean | null;
  }>({
    error: "",
    result: null,
  });
  let subscriberTags = tags;

  // Optionally get tags from search params
  const searchParams = useSearchParams();
  if (tagsFromSearchParams) {
    const tag = searchParams.getAll("tag");
    // Query can contain multiple tags
    subscriberTags = tag ? (typeof tag === "string" ? [tag] : tag) : [];
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.assign(
      { tags: subscriberTags },
      formDataToObject(formData)
    );
    setLoading(true);
    const res = await fetch("/api/newsletter/subscribe", {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    setLoading(false);
    if (res.status === 201) {
      setResponse({ result: true, error: "" });
    } else {
      const { error } = await res.json();
      console.log("Error:", error);
      setResponse({ result: false, error });
    }
  };

  const submitDisabled = loading || response.result === true;

  return (
    <form onSubmit={onSubmit}>
      {showHeader && <p className="mb-2 text-basis text-lg">Get Notified</p>}

      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
        {fields.map((f, idx) => {
          return (
            <input
              key={idx}
              className={`md:min-w-72 flex-grow border border-muted rounded-md px-4 py-2 text-white bg-transparent
                focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-border-success))] focus:border-transparent
                placeholder:text-muted
                grow
              `}
              type="text"
              id={`${f.name}-input`}
              name={f.name}
              placeholder={f.label}
              required
              autoCapitalize="off"
              autoCorrect="off"
            />
          );
        })}
        <div className="w-full flex flex-col sm:flex-row gap-4 pb-px">
          <input
            className={`md:min-w-72 flex-grow border border-muted rounded-md px-4 py-2 text-white bg-transparent
            focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-border-success))] focus:border-transparent
            placeholder:text-muted
            grow
          `}
            type="email"
            id="email-input"
            name="email"
            placeholder="Enter email address"
            ref={inputRef}
            required
            autoCapitalize="off"
            autoCorrect="off"
          />
          <button
            type="submit"
            name="register"
            disabled={submitDisabled}
            className={`
              group inline-flex items-center justify-center gap-0.5
              px-12 py-2
              rounded-md transition-all
              text-carbon-1000
              bg-cta hover:bg-ctaHover
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-cta
              text-sm font-medium whitespace-nowrap`}
          >
            {buttonText}
          </button>
        </div>
      </div>
      {response.error && (
        <p className="mt-2 text-white text-center text-lg">{response.error}</p>
      )}
      {response.result && (
        <p className="mt-2 text-white text-center text-lg">
          Great - You're all set!
        </p>
      )}
    </form>
  );
}

function formDataToObject(formData: FormData): { [key: string]: string } {
  const data = {};
  for (let [key, value] of Array.from(formData.entries())) {
    data[key] = value;
  }
  return data;
}
