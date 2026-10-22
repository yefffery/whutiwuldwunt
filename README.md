# WIWW verification

Run the isolated D1 route tests from the Site checkout with Node 24:

```sh
node --loader ./tests/promotion-loader.mjs ./tests/content.test.mjs
node --loader ./tests/promotion-loader.mjs ./tests/care.test.mjs
node --loader ./tests/promotion-loader.mjs ./tests/operations.test.mjs
node --loader ./tests/promotion-loader.mjs ./tests/feedback.test.mjs
node --loader ./tests/promotion-loader.mjs ./tests/promotions.test.mjs
node --loader ./tests/promotion-loader.mjs ./tests/cms-variables.mjs
node --loader ./tests/promotion-loader.mjs ./tests/practical-flow.mjs
node --loader ./tests/promotion-loader.mjs ./tests/release-integrity.mjs
node --loader ./tests/promotion-loader.mjs ./tests/theme-philosophy.mjs
node --loader ./tests/promotion-loader.mjs ./tests/care-interests.mjs
node --loader ./tests/promotion-loader.mjs ./tests/mascot-moments.mjs
node --loader ./tests/promotion-loader.mjs ./tests/member-suppression.mjs
node --loader ./tests/promotion-loader.mjs ./tests/operating-model.mjs
node --loader ./tests/promotion-loader.mjs ./tests/cross-conversation-consistency.mjs
node --loader ./tests/promotion-loader.mjs ./tests/care-value.mjs
node --loader ./tests/promotion-loader.mjs ./tests/care-reveal-areas.mjs
```

The route harness applies the checked-in SQLite migrations to an in-memory database, stubs owner authentication, and blocks real provider requests. It creates no live requests and sends no customer messages.

`cms-variables.mjs` tests the pure helper contract: allowlisted reads/writes, strict integer cents, shared schema limits, quote-only protection fields, stable IDs, boolean values, and full source immutability. It does not exercise browser messaging, the inspector UI, or D1 persistence.

`content.test.mjs` checks D1-backed draft/published separation, revision restore and conflict handling, inline text persistence, editable service prices/add-ons/questions/messages, and validation. The other suites check Care Plan and Care Key states, manual appointment and job operations, owner/origin restrictions, and the disabled external-promotion path.

These tests exercise route handlers and content helpers. They do not substitute for testing the authenticated `/manage` browser UI or phone-sized layouts. Before publishing, complete those UI checks in an isolated owner session and staging database. The Variable Inspector is implemented; its rendered hover, focus, and save workflow still requires browser verification. RELEASE-MAP.md records the current controls and open acceptance checks.

Release-integrity coverage: `node --loader ./tests/promotion-loader.mjs ./tests/release-integrity.mjs` verifies first-time eligibility, normalized phones, inactive codes, one-time claims, plan revisions, historical amounts, required fields and failed-submission suppression.

Theme and universal-copy checks: `node --loader ./tests/promotion-loader.mjs ./tests/theme-philosophy.mjs`. These cover preference switching/persistence and saved-copy normalization without claiming visual browser verification.

`care-interests.mjs` checks the approved price-free add-on catalog and verifies that the mid-flow offer carries the chosen service and customer-provided details into the remaining booking steps. `mascot-moments.mjs` confirms that public mascot interaction triggers remain removed. `member-suppression.mjs` tests first-visit eligibility and durable offer state. Browser verification remains separate.

`operating-model.mjs` tests logistics and arrival-window persistence for enhanced and native forms, retired-service rejection, acceptance-gated window preferences without automatic booking, and unchanged accepted prices. Prices and durations must come from management-approved values.

`cross-conversation-consistency.mjs` verifies homepage package availability, quote-only pricing, and browser-local introduction validation, clearing, and storage failures. It does not claim mobile-device verification.

`care-value.mjs` checks contextual package increments, current-menu savings, relevant priced add-on ordering, optional interest validation, wax/ceramic preparation overlap, unchanged estimates, and customer-ID-based historical completed-value aggregation. Values are not payment receipts or profit, and customer interests do not grant messaging consent.

`care-reveal-areas.mjs` verifies that exterior-only, interior-only, and combined Care Reveal selections highlight only their selected service areas. The suite contains seventeen standalone scripts.
