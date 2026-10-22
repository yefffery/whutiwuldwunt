import { z } from "zod";
import { sourceConfig } from "@/lib/business-config";

/** Inquiry kinds: a care inquiry, a general message, or a team opportunity. */
export const RequestKind = z.enum(["inquiry", "message", "opportunity"]);
export type RequestKind = z.infer<typeof RequestKind>;

const stringArray = (max: number, itemMax: number) =>
  z.array(z.string().max(itemMax)).max(max).default([]);

/**
 * The inquiry payload. Selections travel as raw string arrays only; there is
 * no cart, no payment and no dynamic total anywhere in this contract.
 * Steps 3 and 4 are non-blocking: a blank or "unsure" answer never throws a
 * client-facing error — the payload simply arrives for human vetting.
 */
export const intakeSchema = z
  .object({
    id: z.string().min(6).max(80),
    token: z.string().min(6).max(200),
    kind: RequestKind,
    services: stringArray(6, 60),
    tier: z.string().max(24).default(""),
    interests: stringArray(12, 160),
    environment: stringArray(12, 60),
    utilities: stringArray(12, 60),
    answers: stringArray(24, 600),
    name: z.string().max(100).default(""),
    email: z.string().max(200).default(""),
    phone: z.string().max(40).default(""),
    city: z.string().max(120).default(""),
    vehicle: z.string().max(160).default(""),
    buildingName: z.string().max(160).default(""),
    preferredDate: z.string().max(10).default(""),
    window: z.string().max(20).default("flexible"),
    topic: z.string().max(40).default("general"),
    message: z.string().max(6000).default(""),
    consent: z.literal(true),
    promo: z.string().max(40).default(""),
    quoteDigest: z.string().max(60).optional(),
    website: z.string().max(0).optional(),
  })
  .strict();

export type IntakePayload = z.infer<typeof intakeSchema>;

const VETTING_FLAG = sourceConfig.vettingFlag;

/**
 * Dialogue-flag model: nothing here throws. When an onboarding parameter was
 * left blank or answered "unsure", the inquiry is flagged for human vetting
 * instead of being rejected at the client.
 */
export function vettingFlags(payload: {
  environment?: string[];
  utilities?: string[];
  tier?: string;
  interests?: string[];
}): string[] {
  const flags: string[] = [];
  const unresolved = (values?: string[]) =>
    !values || values.length === 0 || values.some((value) => /unsure|not sure/i.test(value));
  if (unresolved(payload.environment)) flags.push(VETTING_FLAG);
  if (unresolved(payload.utilities)) flags.push(VETTING_FLAG);
  if (!payload.tier || /unsure|not sure/i.test(payload.tier)) flags.push(VETTING_FLAG);
  return [...new Set(flags)];
}
