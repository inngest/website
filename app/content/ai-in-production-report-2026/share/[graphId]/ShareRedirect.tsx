"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { REPORT_LANDING_PATH } from "../../graphs";

export default function ShareRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(REPORT_LANDING_PATH);
  }, [router]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-subtle">
      Redirecting to the 2026 Durable Execution Benchmark Report…
    </div>
  );
}
