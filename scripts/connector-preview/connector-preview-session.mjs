// Reads the local connector preview session file, when one exists.
import { readFileSync } from "node:fs";
import path from "node:path";

export function readPreviewSession(projectRoot) {
  try {
    const raw = readFileSync(path.join(projectRoot, ".sites-runtime", "connector-preview", "session.json"), "utf8");
    const session = JSON.parse(raw);
    if (session.expiresAt !== null && !(session.expiresAt > Date.now())) return null;
    return session;
  } catch {
    return null;
  }
}
