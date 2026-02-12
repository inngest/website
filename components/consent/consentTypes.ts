export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type GeoRegion = "eu" | "ca" | "other";

export type ConsentCategories = Record<ConsentCategory, boolean>;

export type ConsentState = {
  hasConsented: boolean;
  region: GeoRegion;
  categories: ConsentCategories;
  consentedAt: string | null;
};

export type ConsentCookieValue = {
  v: 1;
  region: GeoRegion;
  categories: ConsentCategories;
  consentedAt: string;
};
