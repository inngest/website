"use client";

import { useRef, useState } from "react";

export default function NewsletterSignup({ tags = [] }: { tags: string[] }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    error: string;
    result: boolean | null;
  }>({
    error: "",
    result: null,
  });

  const subscribeUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/newsletter/subscribe", {
      body: JSON.stringify({
        // @ts-ignore
        email: inputRef.current.value,
        tags,
      }),
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
      console.log(error);
      setResponse({ result: false, error });
    }
  };

  const canSubmit = response.result !== true || response.error !== "";

  return (
    <form onSubmit={subscribeUser}>
      <p className="mb-2 text-basis text-lg">Get notified:</p>

      <div className="flex flex-row flex-wrap gap-4">
        <input
          className={`max-w-80 flex-grow border border-muted rounded-md px-4 py-2 text-white bg-transparent
            focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-border-success))] focus:border-transparent
            placeholder:text-muted
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
        {canSubmit && (
          <button
            type="submit"
            name="register"
            disabled={loading || response.result === true}
            className={`whitespace-nowrap button group inline-flex items-center justify-center gap-0.5
                px-12 py-2
                rounded-md transition-all
                text-alwaysWhite bg-btnPrimary hover:bg-btnPrimaryHover
                text-sm font-medium
            ${loading ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            Submit
          </button>
        )}
        <div></div>
      </div>
      {response.error && (
        <p className="mt-2 text-white text-sm">{response.error}</p>
      )}
      {response.result && (
        <p className="mt-2 text-white text-sm">
          Great! You're all set to receive updates on Inngest Launch Week!
        </p>
      )}
    </form>
  );
}
