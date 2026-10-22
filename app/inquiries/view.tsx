"use client";

import { useState } from "react";

export interface QueueRow {
  id: string;
  kind: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  vehicle: string;
  topic: string;
  message: string;
  status: string;
  created_at: number;
  services: string[];
  environment: string[];
  utilities: string[];
  interests: string[];
  flags: string[];
}

/** The personal verification queue. Inquiries arrive here as raw string
 * arrays; anything unresolved is flagged `requires_human_vetting`. */
export default function InquiriesView({
  owner,
  rows,
  ownerConfigured,
}: {
  owner: boolean;
  rows: QueueRow[];
  ownerConfigured: boolean;
}) {
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/owner-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Sign-in failed.");
        return;
      }
      window.location.reload();
    } finally {
      setBusy(false);
    }
  }

  if (!owner) {
    return (
      <div className="wrap owner-gate">
        <h1>Owner sign-in</h1>
        {!ownerConfigured && <p className="note">Owner access is not configured on this deployment.</p>}
        {ownerConfigured && (
          <form onSubmit={signIn} className="owner-gate-form">
            <label className="field" htmlFor="owner-passphrase">
              Owner passphrase
              <input
                id="owner-passphrase"
                type="password"
                autoComplete="current-password"
                required
                value={passphrase}
                onChange={(event) => setPassphrase(event.target.value)}
              />
            </label>
            {error && <p className="error" role="alert">{error}</p>}
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Checking…" : "Open the queue"}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="wrap inquiries-queue">
      <h1>Personal verification queue</h1>
      <p className="lede">
        Every inquiry lands here as raw string arrays. Rows flagged <code>requires_human_vetting</code> have an
        unresolved onboarding answer (a blank, or “not sure”) that needs a human look before a Care Plan is prepared.
      </p>
      {rows.length === 0 && <p className="note">No inquiries yet.</p>}
      <div className="queue-list">
        {rows.map((row) => (
          <article className="queue-row" key={row.id}>
            <header>
              <strong>{row.name || "Unnamed"}</strong>
              <span className="tag">{row.kind}</span>
              {row.flags.includes("requires_human_vetting") && (
                <span className="tag vetting-flag">requires_human_vetting</span>
              )}
              <time>{new Date(row.created_at).toLocaleString()}</time>
            </header>
            <dl>
              <div><dt>Contact</dt><dd>{row.email || "—"} · {row.phone || "—"} · {row.city || "—"}</dd></div>
              <div><dt>Vehicle</dt><dd>{row.vehicle || "—"}{row.environment.length > 0 ? ` · setting: ${row.environment.join(", ")}` : ""}</dd></div>
              <div><dt>Care discussed</dt><dd>{row.services.length > 0 ? row.services.join(", ") : "not sure yet"}</dd></div>
              {row.utilities.length > 0 && <div><dt>Utilities</dt><dd>{row.utilities.join(", ")}</dd></div>}
              {row.interests.length > 0 && <div><dt>Open conversation points</dt><dd>{row.interests.join(", ")}</dd></div>}
              {row.message && <div><dt>Message</dt><dd className="queue-message">{row.message}</dd></div>}
            </dl>
            <footer>Request {row.id.slice(0, 12)}</footer>
          </article>
        ))}
      </div>
    </div>
  );
}
