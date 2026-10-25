# WIWW Identity Placement · Staging Acceptance 2026-10-24

Status: OWNER-APPROVED DESIGN RULES; IMPLEMENTATION AND VISUAL/OWNER ACCEPTANCE NOT YET VERIFIED.
Public site must remain unchanged until explicit acceptance. Not a deployment receipt.

## Scope
- Integrate only the three owner-finalized identity assets (logo, symbol, mascot). Do not regenerate, alter pixels, add details, invent variants, or replace source artwork.
- Logo: top-left sticky navigation, footer, formal confirmation/receipt. Logo remains identifiable, keyboard-operable as home navigation, responsive without unauthorized cropping.
- Symbol: expressive-only transition or appropriate customer-approved care record; signify reciprocity, never confirmation, protection performance, loyalty benefits, or completed work unless the underlying state warrants it.
- Mascot: optional discovery, service education, genuine empty states, and aftercare. Small static appearance within request allowed only if subordinate to price, terms, form fields, errors, and submit action. No intrusive widget, forced introduction, or mascot that prevents/interrupts booking.
- Never add invented public proof, prices, warranties, service categories, review counts, or durations.

## Non-regression constraints
- Request -> Review -> Confirmation (request submission is not an appointment).
- Services, eligibility, and pricing from approved published business records; no hardcoded price or vehicle-size assumptions.
- Protected server-side quote snapshot (scope, price, terms, business/service revision).
- Prevent stale edit overwrite, protect authorization/owner-only fields and customer privacy.
- Preserve booking continuity, error recovery, no-JS submission path where currently supported.
- Don't alter existing dark/light preference and content publishing workflow.

## Explicit implementation mapping
1. Header: swap the primary identifier to owner-finalized logo asset using approved file path, meaningful alt text; logo acts as home link.
2. Footer: finalized logo, no mascot interrupting footer contacts/links.
3. Section transitions: finalized symbol only in expressive layer; decorative instances aria-hidden, care-record instances meaningful and state-driven.
4. Brand story and learning/empty states: finalized mascot, decorative unless it conveys actual state; its story link optional and dismissible. Never include forced hover triggers.
5. Booking UI: no art over fields, pricing, receipt, errors, or submit; enforce truthful status text and responsive layout.
6. Asset configuration: all refs point to owner supplied approved masters and maintain original geometry. Add an explicit owner-controlled asset version or id and ensure existing CMS publishes previews deliberately.

## Required acceptance
- Assets pixel-fidelity comparison against owner masters (all three).
- 320, 375, 768 and 1440 px: inspect sticky header, hero, service selector, request, error and receipt on both themes.
- Zoom 200% and 400%; keyboard/touch navigation and focus, screen reader labels, reduced motion.
- Dark/light contrast and no broken image layout if an asset fails to load.
- Price/terms unchanged, quote snapshots unchanged across later pricing edits.
- Duplicate requests, stale edit protection, partial form recovery, success-only suppression.
- Owner /manage authentication and permissions in an isolated staging environment.
- Run repository's 17 route suites and lint/type/build, recording results and screenshots.
- Validate same result with original approved brand assets and never use placeholder AI outputs.
- Explicit owner review and staging site URL required before public deployment.

## Deployment status
No staging hosting target or deployed URL has been verified by this change alone.
This is an isolated preparation branch, not a visual implementation or published site.
