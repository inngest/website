import { PLANS, type Plan } from "./plans";

const HOST = "https://www.inngest.com";

/**
 * Schema.org Offer for each pricing plan, built from the same PLANS data as
 * the pricing cards so the structured data can't drift from the page.
 * Plans with a numeric price get price + currency (the plan's base monthly
 * price); "Custom" plans get an offer without a price. No priceSpecification:
 * Google's Rich Results Test flags UnitPriceSpecification as an invalid type
 * on software app offers.
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
    return { ...offer, price: String(price), priceCurrency: "USD" };
  });
}
