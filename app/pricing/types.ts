export type Plan = {
  name: string;
  cost: {
    startsAt?: boolean;
    between?: boolean;
    // Use numbers for calculators
    basePrice: number | string;
    endPrice?: number;
    includedRuns: number | string;
    additionalRunsPrice: number | string | null;
    additionalRunsRate?: number;
    includedSteps: number | string;
    additionalStepsPrice: number | string | null;
    additionalStepsRate?: number;
    includedConcurrency: number | string;
    additionalConcurrencyPrice: number | string | null;
    additionalConcurrencyRate?: number;
    includedUsers: number | string;
    additionalUsersPrice: number | string | null;
    additionalUsersRate?: number;
    period?: string;
  };
  description: React.ReactFragment | string;
  hideFromCards?: boolean;
  recommended?: boolean;
  primaryCTA?: boolean;
  cta: {
    href: string;
    text: string;
  };
  highlights: {
    runs: string;
    concurrency: string;
  };
  planIncludes: string;
  features: string[];
};

export type Feature = {
  name: string;
  description?: string;
  section:
    | "platform"
    | "recovery"
    | "observability"
    | "data"
    | "connectivity"
    | "organization";
  all?: boolean | string; // All plans offer this
  plans?: {
    [key: string]: string | boolean | { value: string; description?: string };
  };
  infoUrl?: string;
};
