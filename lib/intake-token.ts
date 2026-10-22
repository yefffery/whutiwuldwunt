import "server-only";

/**
 * Stateless request tokens: HMAC-SHA256 over an expiry stamp, keyed by
 * CARE_PLAN_LINK_KEY. The Workers runtime provides WebCrypto.
 */
function keyMaterial(): Uint8Array {
  const secret = process.env.CARE_PLAN_LINK_KEY || "wiww-development-link-key";
  return new TextEncoder().encode(secret);
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial() as unknown as ArrayBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Mint a token valid for one day. */
export async function createIntakeToken(): Promise<string> {
  const expires = Date.now() + 24 * 60 * 60 * 1000;
  return `${expires}.${await hmac(String(expires))}`;
}

/** Verify a token's stamp and signature. */
export async function verifyIntakeToken(token: string): Promise<boolean> {
  const [expires, signature] = String(token).split(".");
  const expiresAt = Number(expires);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now() || !signature) return false;
  return (await hmac(String(expiresAt))) === signature;
}

export async function ownerCookieValue(ownerEmail: string): Promise<string> {
  return `owner.${await hmac(`owner:${ownerEmail}`)}`;
}
