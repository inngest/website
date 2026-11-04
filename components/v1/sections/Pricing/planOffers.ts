import { PLANS, type Plan } from "./plans";

const HOST = "https://www.inngest.com";

/**
 * Schema.org Offer for each pricing plan, built from the same PLANS data as
 * the pricing cards so the structured data can't drift from the page.
 * Plans with a numeric price get a monthly price ("starting at" plans also
 * set minPrice); "Custom" plans get an offer without a price.
 */
export function planOffers(plans: Plan[] = PLANS): Record<string, unknown>[] {
  return plans.map((plan) => {
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      name: plan.name,
      description: plan.description,
      url: `${HOST}/pricing`,
    };
    const price = plan.cost.basePrice;
    if (typeof price !== "number") return offer;
    return {
      ...offer,
      price: String(price),
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: "USD",
        ...(plan.cost.startsAt ? { minPrice: price } : {}),
        ...(plan.cost.period === "mo" ? { billingDuration: "P1M" } : {}),
      },
    };
  });
}
