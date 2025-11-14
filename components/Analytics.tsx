"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "@/utils/segment";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    analytics.page(null, {
      ref: searchParams.get("ref"),
    });
  }, [pathname, searchParams]);

  return null;
}
