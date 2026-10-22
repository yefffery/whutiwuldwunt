import { env } from "cloudflare:workers";
export function getRawDb() { if (!env.DB) throw new Error("Request storage is unavailable"); return env.DB; }
