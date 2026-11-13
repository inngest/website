"use client";

import { useEffect, useState } from "react";
import { checkEmailDomain, type EmailProblem } from "@/utils/emailTypos";

/**
 * Catches a mistyped email domain (`.con`, `@gnail.com`) on submit.
 * The first submit with a suspect address stops and shows the fix;
 * submitting the same address again sends it anyway, so a real address
 * the check doesn't know is never locked out.
 */
export function useEmailTypoCheck(
  email: string,
  setEmail: (email: string) => void
) {
  const [problem, setProblem] = useState<EmailProblem | null>(null);
  const [warnedFor, setWarnedFor] = useState<string | null>(null);

  // Editing the address clears the warning.
  useEffect(() => {
    if (warnedFor !== email.trim()) setProblem(null);
  }, [email, warnedFor]);

  /** Call on submit. False means stop: the hint is now showing. */
  const okToSend = (): boolean => {
    const value = email.trim();
    const found = checkEmailDomain(value);
    if (found && warnedFor !== value) {
      setProblem(found);
      setWarnedFor(value);
      return false;
    }
    setProblem(null);
    return true;
  };

  const applySuggestion = () => {
    if (!problem?.suggestion) return;
    setEmail(problem.suggestion);
    setWarnedFor(null);
    setProblem(null);
  };

  return { problem, okToSend, applySuggestion };
}

/** The message under the email field, with a one-tap fix. */
export function EmailTypoHint({
  id,
  problem,
  onApplySuggestion,
  className = "",
}: {
  id: string;
  problem: EmailProblem | null;
  onApplySuggestion: () => void;
  className?: string;
}) {
  if (!problem) return null;
  return (
    <p
      id={id}
      role="alert"
      className={`text-[14px] leading-[20px] ${className}`}
    >
      {problem.message}{" "}
      {problem.suggestion && (
        <button
          type="button"
          onClick={onApplySuggestion}
          className="font-semibold underline underline-offset-4 hover:no-underline"
        >
          Use it
        </button>
      )}
      <span className="opacity-70"> Or submit again to keep yours.</span>
    </p>
  );
}
