"use client";
import { useState, useEffect } from "react";

type Impact = "partial_outage" | "degraded_performance" | "full_outage";
type Indicator = Impact | "none" | "maintenance";
type StatusEvent = {
  id: string;
  name: string;
  url: string;
  last_update_at: string; // ISO-8601
  last_update_message: string;
  affected_components: {
    id: string;
    name: string;
    group_name?: string;
  }[];
};
type Incident = StatusEvent & {
  status: "identified" | "investigating" | "monitoring";
  current_worst_impact: Impact;
};
type MaintenanceInProgressEvent = StatusEvent & {
  status: "maintenance_in_progress";
  started_at: string; // ISO-8601
  scheduled_end_at: string; // ISO-8601
};
type MaintenanceScheduledEvent = StatusEvent & {
  status: "maintenance_scheduled";
  starts_at: string; // ISO-8601
  ends_at: string; // ISO-8601
};

type StatusPageSummaryResponse = {
  page_title: string;
  page_url: string;
  ongoing_incidents: Incident[];
  in_progress_maintenances: MaintenanceInProgressEvent[];
  scheduled_maintenances: MaintenanceScheduledEvent[];
};

type Status = {
  url: string;
  description: string;
  impact: Indicator;
  updated_at: string;
};

const impactMessage: { [K in Indicator]: string } = {
  none: "All systems operational",
  degraded_performance: "Degraded performance",
  partial_outage: "Partial system outage",
  full_outage: "Major system outage",
  maintenance: "Maintenance in progress",
};
// We use hex colors b/c tailwind only includes what is initially rendered
const statusColor: { [K in Indicator]: string } = {
  none: "rgba(var(--color-matcha-500))",
  degraded_performance: "rgb(var(--color-honey-300))",
  maintenance: "rgb(var(--color-honey-300))",
  partial_outage: "rgb(var(--color-honey-500))",
  full_outage: "rgb(var(--color-ruby-500))",
};

const STATUS_PAGE_URL = "https://status.inngest.com";

const fetchStatus = async (): Promise<StatusPageSummaryResponse> => {
  return await fetch("https://status.inngest.com/api/v1/summary").then((r) =>
    r.json()
  );
};

const useStatus = (): Status => {
  const [status, setStatus] = useState<Status>({
    url: STATUS_PAGE_URL,
    description: "Fetching status...",
    impact: "none",
    updated_at: "",
  });
  useEffect(() => {
    (async function () {
      try {
        const res = await fetchStatus();
        // Grab first incident and maintenance item
        const incident = res.ongoing_incidents[0];
        const maintenance = res.in_progress_maintenances[0];
        const impact =
          incident?.current_worst_impact ||
          (maintenance ? "maintenance" : "none");
        setStatus({
          impact,
          description: impactMessage[impact],
          updated_at: incident?.last_update_at || new Date().toString(),
          url: incident?.url || STATUS_PAGE_URL,
        });
      } catch (e) {
        setStatus({
          description: "Status page",
          impact: "none",
          updated_at: "",
          url: STATUS_PAGE_URL,
        });
      }
    })();
  }, []);
  return status;
};

export function StatusIcon({ className = "" }: { className?: string }) {
  const status = useStatus();
  return (
    <span className={`${className} inline-flex items-center justify-center`}>
      <span
        className={`inline-flex m-auto w-2 h-2 rounded-full`}
        style={{ backgroundColor: statusColor[status.impact] }}
        title={`${status.description} - Status updated at ${status.updated_at}`}
      ></span>
    </span>
  );
}

export default function StatusWidget({
  className = "",
}: {
  className?: string;
}) {
  const status = useStatus();
  return (
    <a
      href={status.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} text-slate-200 font-medium bg-canvasSubtle hover:bg-canvasMuted transition-all rounded text-sm px-4 py-2 inline-flex items-center`}
      title={`Status updated at ${status.updated_at}`}
    >
      <span
        className={`inline-flex w-2 h-2 mr-2 rounded-full`}
        style={{ backgroundColor: statusColor[status.impact] }}
      ></span>
      {status.description}
    </a>
  );
}
