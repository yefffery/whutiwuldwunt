export const FOUNDING_OFFER_CODE = "WIWW-FOUNDING10";
export const FOUNDING_OFFER_EVENT = "wiww-claim-founding-offer";
export const FOUNDING_OFFER_TERMS =
  "10% off the first approved visit. One offer per household; offers do not stack. WIWW verifies the offer against your phone and request before it is applied to your Care Plan.";

/** Normalized eligibility key for a U.S. phone number; empty when invalid. */
export function offerPhoneKey(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  if (digits.length === 10) return digits;
  return "";
}
