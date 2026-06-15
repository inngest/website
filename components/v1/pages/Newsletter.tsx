"use client";

import { useRef, useState, type FormEvent, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PageShell from "@/components/v1/PageShell";
import { INPUT_CLASSES } from "@/components/v1/forms/fieldStyles";
import Button from "@/components/v1/Button";

function NewsletterForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const searchParams = useSearchParams();
  const tags = searchParams.getAll("tag");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      tags,
    };
    setLoading(true);
    const res = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    if (res.status === 201) {
      setResult("success");
    } else {
      const { error } = await res.json();
      setErrorMsg(error ?? "Something went wrong. Please try again.");
      setResult("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      {result === "success" ? (
        <p className="text-center font-v1Body text-v1-body-lg text-v1-frost">
          You&rsquo;re all set — welcome aboard!
        </p>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              ref={inputRef}
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              autoCapitalize="off"
              autoCorrect="off"
              disabled={loading}
              className={INPUT_CLASSES + " flex-1"}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="shrink-0"
            >
              {loading ? "Subscribing…" : "Subscribe"}
            </Button>
          </div>
          {result === "error" && (
            <p className="mt-3 text-center font-v1Body text-sm text-red-400">
              {errorMsg}
            </p>
          )}
        </>
      )}
    </form>
  );
}

export default function Newsletter() {
  return (
    <PageShell>
      <section
        aria-labelledby="newsletter-heading"
        className="flex min-h-[70vh] items-center justify-center px-6"
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="font-v1Mono text-[13px] uppercase tracking-[0.12em] text-v1-accent-salmon">
            Newsletter
          </p>
          <h1
            id="newsletter-heading"
            className="font-v1Heading leading-[1.1] tracking-[-0.02em] text-v1-frost"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Stay in the loop.
          </h1>
          <p className="max-w-[420px] text-v1-body-lg text-v1-frost/70">
            Be the first to hear about new features, beta releases, and
            important updates from the Inngest team.
          </p>
          <Suspense>
            <NewsletterForm />
          </Suspense>
        </div>
      </section>
    </PageShell>
  );
}
