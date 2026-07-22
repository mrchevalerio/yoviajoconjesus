export interface PromoCode {
  code: string;
  discountAmount: number;
}

const PROMO_CODES: PromoCode[] = [{ code: "ASEGURADO", discountAmount: 10 }];

export interface PromoResult {
  fare: number;
  discount: number;
  valid: boolean;
}

/**
 * Always call this server-side with the raw code the client typed — never
 * trust a client-supplied discount amount directly, or the checkout price
 * becomes tamperable again.
 */
export function applyPromoDiscount(fare: number, rawCode: string | undefined | null): PromoResult {
  const normalized = rawCode?.trim().toUpperCase();
  if (!normalized) return { fare, discount: 0, valid: false };

  const promo = PROMO_CODES.find((p) => p.code === normalized);
  if (!promo) return { fare, discount: 0, valid: false };

  const discount = Math.min(promo.discountAmount, fare);
  return { fare: Math.max(0, fare - discount), discount, valid: true };
}
