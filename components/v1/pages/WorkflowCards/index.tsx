"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PageShell from "@/components/v1/PageShell";
import Button from "@/components/v1/Button";
import { cn } from "@/utils/v1/cn";
import { CHARACTERS, CHARACTER_IDS, type CharacterId } from "./characters";
import {
  CARD_KINDS,
  WORKFLOW_SOURCE,
  cardQuery,
  runWeirdWorkflow,
  sanitizeGithub,
  sanitizeName,
  type CardInput,
  type CardKind,
} from "./workflow";

const KIND_LABELS: Record<CardKind, { title: string; blurb: string }> = {
  participating: {
    title: "I'm participating",
    blurb: "Announce your run is in progress.",
  },
  completed: {
    title: "I completed it",
    blurb: "…and all you got was this card.",
  },
  stuck: {
    title: "I'm not stuck",
    blurb: "You're waiting for an event. Totally different.",
  },
};

/**
 * Center-crops an uploaded photo to a small square JPEG data URL, so the
 * upload to the card route stays tiny. Nothing is stored server-side.
 */
async function toFaceDataURL(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const size = 320;
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas
    .getContext("2d")!
    .drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      size,
      size
    );
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

/** ms between trace rows appearing while the workflow "runs". */
const STEP_MS = 260;

export default function WorkflowCards({
  initial,
}: {
  initial: CardInput | null;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [kind, setKind] = useState<CardKind>(initial?.kind ?? "participating");
  const [day, setDay] = useState(initial?.day ?? 1);
  const [github, setGithub] = useState(initial?.github ?? "");
  const [character, setCharacter] = useState<CharacterId>(
    initial?.character ?? "pizza"
  );
  // An uploaded photo (data URL). Only ever sent to the card route to be
  // drawn, never stored, so it isn't part of the share link.
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState(false);
  // The card drawn with the photo, as a blob URL.
  const [photoCard, setPhotoCard] = useState<string | null>(null);

  // The input of the card that has been (or is being) run.
  const [run, setRun] = useState<CardInput | null>(initial);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const spec = useMemo(() => (run ? runWeirdWorkflow(run) : null), [run]);
  const query = run ? cardQuery(run) : "";
  const imageURL = run ? `/api/workflow-card?${query}` : "";
  // With a photo, the card comes from a POST instead of the GET URL.
  const [runPhoto, setRunPhoto] = useState<string | null>(null);
  const displayURL = runPhoto ? photoCard : imageURL;

  useEffect(() => {
    if (!runPhoto || !query) return;
    let url: string | null = null;
    let cancelled = false;
    setPhotoCard(null);
    fetch("/api/workflow-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, face: runPhoto }),
    })
      .then((res) => (res.ok ? res.blob() : Promise.reject(res.status)))
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setPhotoCard(url);
      })
      .catch(() => !cancelled && setRunPhoto(null)); // fall back to GET
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [runPhoto, query]);
  const done = spec ? visibleSteps >= spec.trace.length : false;

  // Play the trace whenever a new run starts.
  useEffect(() => {
    if (!spec) return;
    setVisibleSteps(0);
    setImageLoaded(false);
    clearInterval(timer.current);
    timer.current = setInterval(() => {
      setVisibleSteps((n) => {
        if (n + 1 >= spec.trace.length) clearInterval(timer.current);
        return n + 1;
      });
    }, STEP_MS);
    return () => clearInterval(timer.current);
  }, [spec]);

  const start = (nonce: number) => {
    const input: CardInput = {
      name: sanitizeName(name) || "A Durable Human",
      kind,
      day: kind === "completed" ? 12 : day,
      nonce,
      github: sanitizeGithub(github),
      character,
    };
    setRun(input);
    setRunPhoto(photo);
    setCopied(false);
    window.history.replaceState(null, "", `?${cardQuery(input)}`);
  };

  // Read after mount so server and client render the same hrefs.
  const [origin, setOrigin] = useState("https://www.inngest.com");
  useEffect(() => setOrigin(window.location.origin), []);
  // Ref tags per channel, so shared cards are attributed to the Build for
  // the Lonng Run campaign (its 12 Days tags all start with "12-days").
  const shareURL = (channel: "link" | "x" | "linkedin") =>
    run
      ? `${origin}/12-days/card?${query}&ref=12-days-card-share-${channel}`
      : "";
  const shareText =
    run?.kind === "completed"
      ? "I completed the 12 Days of Workflows and all I got was this card."
      : "I'm doing the 12 Days of Workflows with @inngest.";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareURL("link"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", shareURL("link"));
    }
  };

  return (
    <PageShell>
      <section className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-28 sm:px-9 lg:px-8 lg:pt-40">
        <p className="text-v1-label-md uppercase text-v1-accent-green">
          12 Days of Workflows · Inngest Card Shop
        </p>
        <h1 className="text-v1-display-sm mt-6 max-w-[900px] text-v1-frost lg:text-v1-display-md">
          Run a weird workflow. Get a weird card.
        </h1>
        <p className="text-v1-body-lg-loose mt-6 max-w-[680px] text-v1-frost/80">
          Every card is made by a function that uses all twelve primitives from
          the series, one per day. It waits for an elf to approve it, sleeps
          until Christmas morning, and A/B tests its own tone. Pick the day
          you&apos;re on and post your progress.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
          {/* Order form */}
          <form
            className="flex flex-col gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              start(0);
            }}
          >
            <label className="flex flex-col gap-3">
              <span className="text-v1-label-md uppercase text-v1-frost/70">
                event.data.name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={28}
                placeholder="Your name"
                className="text-v1-body-lg rounded-lg border border-v1-frost/20 bg-v1-jetBlack px-4 py-3 text-v1-frost placeholder:text-v1-frost/40 focus:border-v1-accent-green focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-3">
              <span className="text-v1-label-md uppercase text-v1-frost/70">
                event.data.github{" "}
                <span className="normal-case text-v1-frost/40">(optional)</span>
              </span>
              <input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                maxLength={60}
                placeholder="your-github-username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="text-v1-body-lg rounded-lg border border-v1-frost/20 bg-v1-jetBlack px-4 py-3 text-v1-frost placeholder:text-v1-frost/40 focus:border-v1-accent-green focus:outline-none"
              />
              <span className="text-v1-body-sm text-v1-frost/50">
                Your avatar becomes the face. Or upload a photo below.
              </span>
            </label>

            <label className="flex flex-col gap-3">
              <span className="text-v1-label-md uppercase text-v1-frost/70">
                event.data.face{" "}
                <span className="normal-case text-v1-frost/40">(optional)</span>
              </span>
              <div className="flex items-center gap-4">
                {photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt="Your uploaded face"
                    className="h-14 w-14 rounded-full object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    setPhotoError(false);
                    if (!file) return;
                    try {
                      setPhoto(await toFaceDataURL(file));
                    } catch {
                      setPhoto(null);
                      setPhotoError(true);
                    }
                  }}
                  className="text-v1-body-sm min-w-0 text-v1-frost/70 file:mr-3 file:rounded-lg file:border-0 file:bg-v1-frost/10 file:px-3 file:py-2 file:text-v1-frost"
                />
                {photo && (
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    className="text-v1-body-sm text-v1-frost/60 underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <span className="text-v1-body-sm text-v1-frost/50">
                {photoError
                  ? "Couldn't read that image. Try a JPEG or PNG."
                  : "Used to draw your card, never stored. Share links use your GitHub avatar instead."}
              </span>
            </label>

            <fieldset className="flex flex-col gap-3">
              <legend className="text-v1-label-md mb-3 uppercase text-v1-frost/70">
                event.data.character
              </legend>
              {CHARACTER_IDS.map((c) => (
                <label
                  key={c}
                  className={cn(
                    "flex cursor-pointer flex-col rounded-lg border px-4 py-3 transition-colors",
                    character === c
                      ? "border-v1-accent-green bg-v1-accent-green/10"
                      : "border-v1-frost/20 hover:border-v1-frost/40"
                  )}
                >
                  <input
                    type="radio"
                    name="character"
                    value={c}
                    checked={character === c}
                    onChange={() => setCharacter(c)}
                    className="sr-only"
                  />
                  <span className="text-v1-body-md text-v1-frost">
                    {CHARACTERS[c].label}
                  </span>
                  <span className="text-v1-body-sm text-v1-frost/60">
                    {CHARACTERS[c].blurb}
                  </span>
                </label>
              ))}
            </fieldset>

            <fieldset className="flex flex-col gap-3">
              <legend className="text-v1-label-md mb-3 uppercase text-v1-frost/70">
                event.data.kind
              </legend>
              {CARD_KINDS.map((k) => (
                <label
                  key={k}
                  className={cn(
                    "flex cursor-pointer flex-col rounded-lg border px-4 py-3 transition-colors",
                    kind === k
                      ? "border-v1-accent-green bg-v1-accent-green/10"
                      : "border-v1-frost/20 hover:border-v1-frost/40"
                  )}
                >
                  <input
                    type="radio"
                    name="kind"
                    value={k}
                    checked={kind === k}
                    onChange={() => setKind(k)}
                    className="sr-only"
                  />
                  <span className="text-v1-body-md text-v1-frost">
                    {KIND_LABELS[k].title}
                  </span>
                  <span className="text-v1-body-sm text-v1-frost/60">
                    {KIND_LABELS[k].blurb}
                  </span>
                </label>
              ))}
            </fieldset>

            {kind !== "completed" && (
              <label className="flex flex-col gap-3">
                <span className="text-v1-label-md uppercase text-v1-frost/70">
                  event.data.day: {day}
                </span>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={day}
                  onChange={(e) => setDay(Number(e.target.value))}
                  className="accent-[rgb(11,221,72)]"
                />
              </label>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="!rounded-lg !bg-v1-accent-green !text-v1-jetBlack hover:!bg-v1-accent-green/85"
            >
              Send shop/card.requested
            </Button>
          </form>

          {/* Run output */}
          <div className="flex min-w-0 flex-col gap-6">
            {!spec ? (
              <div className="flex aspect-[1200/630] items-center justify-center rounded-xl border border-dashed border-v1-frost/20 p-8 text-center">
                <p className="text-v1-body-md max-w-sm text-v1-frost/60">
                  No runs yet. Send an event to start the workflow.
                </p>
              </div>
            ) : (
              <>
                <div className="relative aspect-[1200/630] overflow-hidden rounded-xl border border-v1-frost/15 bg-v1-jetBlack">
                  {done && displayURL && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={displayURL}
                      src={displayURL}
                      alt={`${spec.headline} — ${spec.input.name}`}
                      onLoad={() => setImageLoaded(true)}
                      className={cn(
                        "absolute inset-0 h-full w-full transition-opacity duration-500",
                        imageLoaded ? "opacity-100" : "opacity-0"
                      )}
                    />
                  )}
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-v1-label-md animate-pulse uppercase text-v1-frost/60">
                        {done ? "Printing your card…" : "Running…"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    variant="primary"
                    size="md"
                    className="!rounded-lg !bg-v1-accent-green !text-v1-jetBlack hover:!bg-v1-accent-green/85"
                  >
                    <a
                      href={
                        runPhoto && photoCard
                          ? photoCard
                          : `${imageURL}&download=1`
                      }
                      download="inngest-12-days-card.png"
                    >
                      Download PNG
                    </a>
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={copyLink}
                    className="!rounded-lg"
                  >
                    {copied ? "Copied" : "Copy share link"}
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="md"
                    className="!rounded-lg"
                  >
                    <a
                      href={`https://x.com/intent/post?text=${encodeURIComponent(
                        shareText
                      )}&url=${encodeURIComponent(shareURL("x"))}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Post on X
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="md"
                    className="!rounded-lg"
                  >
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        shareURL("linkedin")
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Share on LinkedIn
                    </a>
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => start((run?.nonce ?? 0) + 1)}
                    className="!rounded-lg"
                  >
                    Rerun
                  </Button>
                </div>

                <ol className="flex flex-col rounded-xl border border-v1-frost/15 bg-v1-jetBlack p-4 font-mono text-sm">
                  {spec.trace.map((row, i) => (
                    <li
                      key={row.primitive}
                      className={cn(
                        "grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 py-1.5 transition-opacity duration-300 sm:grid-cols-[1.75rem_10.5rem_minmax(0,1fr)_5.5rem]",
                        i >= visibleSteps
                          ? "opacity-0"
                          : row.status === "pending"
                          ? "opacity-40"
                          : "opacity-100"
                      )}
                    >
                      <span
                        className={
                          row.status === "current"
                            ? "text-v1-accent-green"
                            : "text-v1-frost/40"
                        }
                      >
                        {String(row.day).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "truncate",
                          row.status === "current"
                            ? "text-v1-accent-green"
                            : "text-v1-frost"
                        )}
                      >
                        {row.primitive}
                      </span>
                      <span className="col-start-2 text-v1-frost/60 sm:col-start-auto">
                        {row.log}
                      </span>
                      <span className="hidden text-right text-v1-frost/40 sm:block">
                        {row.duration}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-v1-heading-card text-v1-frost lg:text-v1-display-xs">
            The workflow behind the card
          </h2>
          <p className="text-v1-body-md mt-4 max-w-[680px] text-v1-frost/70">
            The build-a-thon rule is to use all twelve primitives from the
            series. This one uses them to make a greeting card, which needs none
            of them. Your card&apos;s run is simulated in the browser, but the
            function follows the series&apos; code.
          </p>
          <pre className="mt-8 overflow-x-auto rounded-xl border border-v1-frost/15 bg-v1-jetBlack p-6 text-sm leading-relaxed text-v1-frost/90">
            <code>{WORKFLOW_SOURCE}</code>
          </pre>
        </div>
      </section>
    </PageShell>
  );
}
