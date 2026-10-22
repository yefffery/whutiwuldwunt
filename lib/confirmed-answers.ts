export const confirmedFallback =
  "I don’t have a confirmed answer for that yet. Use the inquiry link below and a person will reply.";

const confirmed: Array<[RegExp, string]> = [
  [/how (much|long)|price|cost/i, "Starting prices are shown by vehicle size on the home page. The final scope and price are confirmed in your Care Plan after we review the car. No payment is collected with a request."],
  [/where.*(located|based)|serve|area/i, "WIWW is based in San Francisco and travels across the Bay Area for the right fit. Travel and timing are confirmed with you first."],
  [/ceramic/i, "Cured ceramic coating is an open conversation, not a fixed package. Tell us about it in your care request and we will prepare a case-by-case scope and price in your Care Plan."],
  [/pay|deposit|charge/i, "No payment is collected with a request. We agree on the plan and the price with you first; payment details come with the approved Care Plan only."],
  [/time|when|available|schedule/i, "We typically work Tuesday through Saturday, 9:00 AM to 4:30 PM. The exact visit window is confirmed with you before the date."],
  [/cleaning|clean my|wash/i, "Yes — Essential Exterior is a careful, paint-safe wash; Fabric Freshness covers the cabin; Total Therapy combines both in one agreed visit."],
];

export function confirmedAnswer(question: string): string {
  const text = (question || "").trim();
  if (!text) return "Ask me anything about our care, prices or process.";
  for (const [pattern, answer] of confirmed) {
    if (pattern.test(text)) return answer;
  }
  return confirmedFallback;
}
