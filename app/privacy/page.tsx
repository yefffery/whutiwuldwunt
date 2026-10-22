import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy details" };

export default function PrivacyPage() {
  return (
    <div className="wrap privacy-page">
      <h1>Privacy details</h1>
      <p>
        WIWW uses the details you send with a care request only to prepare and reply about that request: to review the
        car, the location and the timing, and to send your Care Plan.
      </p>
      <p>
        Requests are reviewed by a person before anything else happens. No payment is collected with a request, and
        nothing is scheduled until you approve the plan.
      </p>
      <p>
        We do not sell your details, and we do not use them for marketing beyond the specific offer you explicitly
        claim. Browser-side details (a saved introduction, an offer code, a theme choice) stay in your own browser and
        can be cleared at any time from the page that saved them.
      </p>
      <p className="note">Questions? Ask WIWW personally from the home page.</p>
    </div>
  );
}
