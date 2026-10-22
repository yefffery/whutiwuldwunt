# WIWW Master Standard 1.0 — owner V72 overwrite

Date: October 21, 2026 (America/Los_Angeles). This document identifies the requested specification; Sites assigns its own saved revision numbers. Scope: existing owner-private acceptance deployment, with matching source saved in the original project. Public V68 is not replaced.

## Applied
- `app/public-home.tsx`: new universal headline and supplied stewardship paragraph, preserving the compact mobile composition and direct care CTA. Public tier amounts now always show two decimals.
- `lib/service-promise.ts`, `lib/business-config.ts`, `lib/site-content.ts`: approved exterior/interior copy and inclusion lists are canonical across public cards, booking, summaries and new server quote snapshots. Service identities, amounts, Total Therapy and history remain intact. Promise revision2 reconciles older current configurations once on read, preserves prices and permits subsequent owner edits. Historical reads explicitly disable reconciliation.
- `app/api/content/route.ts`: an explicit owner history restore marks the restored draft as reconciled while retaining its exact earlier service scope, so the new default does not defeat restoration. Restore remains private until a separate owner publish. No request records are overwritten.
- `app/book/view.tsx`: supplied Step2 guide and visible Choose in the care request action text. The existing single native button remains the selection control; no nested or duplicate action.
- `app/book/care-interest-picker.tsx`, `lib/care-interests.ts`, `app/book/native-care-fields.tsx`: coating card shows all three reference amounts and supplied procedure copy; selection only flags interest, retains the clay overlap guard, and never enters the numerical base estimate. Exact shortened accordion caution and nine discussion items remain.
- `lib/care-selector.ts`, `app/book/care-profile.tsx`: revised Site environment & parking text; Covered garage label retains its historical garage value; optional confirmations and all eight condition flags remain. Native fallback mirrors the approved wording.
- `app/site-shell.tsx`, `app/globals.css`: both supplied footer paragraphs with readable responsive columns, reference-tier layout and action styling; existing logo and artwork retained.

One deliberate wording qualification: coating says a long-term layer, not a permanent layer, because its stated term is 36–48 months. No extra durability, equipment, timing or scheduling guarantee was invented.

## Verification

18 executable regression scripts pass; logs and exact exit inventory are included. Tests cover fixed prices, interest-only estimates, redundant clay removal, native intake, request idempotency, immutable snapshots, current configuration reconciliation, historical scope preservation and actual owner restore route behavior. Source-preserving restoration was added as a regression scenario. Text assertions were updated only where the owner explicitly changed wording. TypeScript and lint pass; lint has zero warnings. git diff --check passes. Final supported production build is executed during packaging.

Browser environment: managed local preview in Chrome, iframe CSS viewport testing (not a physical phone). No authenticated deployed owner session was available; earlier complete-release owner/browser requirements remain open.

Observed:
- 375px dark: complete new hero visible and readable; body scrollWidth360 equals clientWidth360, excluding scrollbar.
- Step2: revised service descriptions, inclusion lists, CTA text and decimal pricing appear. Coating reference values242.00/290.40/338.80 render, and selecting coating leaves Essential Exterior at90.75; clay becomes Already included. Nine accordion items retain correct labels and copy.
- 320px light: coating tiers and long text wrap; document scrollWidth305 equals clientWidth305. Screenshot included.
- Step3: new header/paragraph, address, four parking choices and optional setup checks rendered. Covered garage verified via keyboard Space and checked radio state.
- Step4: eight condition choices render, visible paint defects selected; no price change.
- 1440px: summary and final review show Essential Exterior90.75, new inclusions/exclusion, address, garage, condition note, and coating interest. Final action remains Start my care request after review; acknowledgement meaning remains request-only. Synthetic fields were filled for review only; no browser submission was sent in this pass. Isolated route tests exercised submission.
- Both footer paragraphs were read from the actual rendered page without truncation.

Evidence: hero-mobile-dark.jpg and coating-mobile-light.jpg. Temporary viewport harness removed before production packaging. No payment, cart, Stripe or automatic booking integration was added.

## Recovery

Retain prior private revision22290bd8cd347a8688b684936c87c47afffc6f9e. Customer snapshots and requests require no rewrite. If rolling back after an owner saves promiseRevision2, use a compatible application or an explicitly validated configuration restoration; do not deploy an older schema that only accepts revision1 over newly saved revision2 content. Never restore an old database over newer requests. This is a bounded private acceptance update, not certification that all prior publication gates have passed.
