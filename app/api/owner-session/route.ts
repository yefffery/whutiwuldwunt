import { ownerCookieValue } from "@/lib/intake-token";

const COOKIE = "wiww-owner";

/** Mock owner sign-in: the passphrase is the configured owner email. */
export async function POST(request: Request) {
  const ownerEmail = process.env.OWNER_EMAIL || "";
  if (!ownerEmail) {
    return Response.json({ error: "Owner access is not configured on this deployment." }, { status: 403 });
  }
  let passphrase = "";
  try {
    const body = (await request.json()) as { passphrase?: string };
    passphrase = String(body.passphrase ?? "");
  } catch {
    return Response.json({ error: "Enter the owner passphrase." }, { status: 400 });
  }
  if (passphrase !== ownerEmail) {
    return Response.json({ error: "That passphrase does not match." }, { status: 401 });
  }
  const value = await ownerCookieValue(ownerEmail);
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "content-type": "application/json",
      "set-cookie": `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 12}`,
    },
  });
}

export async function GET(request: Request) {
  const ownerEmail = process.env.OWNER_EMAIL || "";
  const cookie = request.headers.get("cookie") ?? "";
  const expected = await ownerCookieValue(ownerEmail);
  const owner = ownerEmail !== "" && cookie.includes(`${COOKIE}=${expected}`);
  return Response.json({ owner });
}

export async function DELETE() {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json", "set-cookie": `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0` },
  });
}
