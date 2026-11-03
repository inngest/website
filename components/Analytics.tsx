"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "@/utils/segment";
import {
  getPageRef,
  installRefClickListener,
  pushRefPageView,
} from "@/utils/v1/refHandoff";

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Record `data-ref` link clicks so the next page knows its ref without a
  // `?ref=` in the URL. See utils/v1/refHandoff.ts.
  useEffect(() => installRefClickListener(), []);

  useEffect(() => {
    // URL `?ref=` first, then a ref handed off by a tracked link click.
    const pageRef = getPageRef();
    analytics.page(null, {
      ref: pageRef?.ref ?? null,
      ...(pageRef ? { ref_source: pageRef.source } : {}),
    });
    if (pageRef) pushRefPageView(pageRef);
  }, [pathname, searchParams]);

  return null;
}
