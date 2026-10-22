# WIWW practical release map

This map describes the implementation and the evidence required to call it finished. Publication is not evidence that browser checks passed.

| Journey | Implemented behavior | Owner control | Verification |
| --- | --- | --- | --- |
| First impression | Dark first; alternate light theme; one Book Intake Audit action goes to service selection | Hero wording inline; both uploaded theme artworks under Brand & images | Schema/type checks; rendered appearance remains a browser gate |
| Welcome invitation | Three-second compact card; no background takeover; explicit details; one request form | Enable/disable, heading and message under All page wording | Storage helper and schema checks; timing, sizing and touch behavior remain browser gates |
| Service selection | Vehicle size, inclusions and starting price together; quote-only services identified; protection selected separately | Names, descriptions, inclusions, size prices, visibility and permitted quote switches | Pure selection assertions; mouse/touch behavior remains a browser gate |
| Package | Only offered when visible and both component services are visible and fixed-price | Explicit package name, prices and visibility | Selection assertions; package is not described as an automatic fraction |
| Logistics | Optional parking/water/power/access notes; Not provided differs from Not sure | Owner reviews contextual rig reasons | Existing schema/route tests; 48px targets require browser inspection |
| Offer claim | Invitation adds 10% claim to the existing form; Care Keys remain separate and cannot stack | Review claim and itemized credit in Care Plan | Existing Care Plan route tests; no automatic price promise |
| Request | One form, receipt, shared browser-local suppression only after success | Incoming requests in management | Existing intake tests; live repeat-submit/network recovery remains unverified |
| Care Plan | Review → proposed scope/price → acceptance → time request → owner confirmation | Manual Care Plan, slot, job and payment controls | Existing Care Plan/operations tests; complete owner browser journey remains unverified |
| Editing | In-memory edits → private Save draft → separate Publish; restore history retained | Text/price inspectors and Advanced settings; desktop preview by default | Mock D1 draft isolation, revision and schema tests |
| Artwork | Separate dark and light uploaded artwork selectors feed the actual homepage | Brand & images; preview hero shortcut | Schema and D1 persistence tests; image presentation remains unverified |

## Editable without code

Homepage wording; dark/light artwork; logos; theme colors; service names/descriptions/inclusions; supported size prices; service/package visibility; supported quote switches; booking questions; invitation heading/message/enabled state; operational message templates; gallery order and visibility.

## Requires a code release

Authentication, allowlisted inspector bindings, database schema, offer percentage/eligibility, suppression mechanics, three-second trigger, booking selection rules, and layout behavior. Editing promotional wording does not change pricing rules. Protection remains quote-only.

## Release acceptance checks

1. Edit prices and both artwork selectors; verify preview, Save draft/reload, and unchanged public content before and after Save draft.
2. Verify visibility/quote switches, service order, inclusions and package behavior against the displayed summary and submitted request.
3. At 375px and a short viewport, verify 48px selection targets, readable artwork text, no horizontal overflow and an unobstructed request button.
4. Check the compact invitation, 44px close control, keyboard dismissal, successful submission suppression, failed submission, and existing dismissal separately.
5. Verify signed-out/non-owner authorization, input-error retention, and the full request → owner review → private Care Plan → acceptance → confirmation → closure journey using labeled test records.

No browser interaction, screen-reader pass, physical phone pass, live provider delivery, or backup restoration has been claimed by the automated tests. No client messages are sent by this release process.

## Master checklist release — October 2026

The only active public offer is the eligible Founding Member 10% credit. New Care Key discounts are inactive; accepted and historical Care Plan amounts remain unchanged.

### Implemented and checked in source / automated tests

- Dark-default foundation with a saved, user-controlled light preference, intact mascot artwork in a full-width mobile image area, copy below the artwork, and brand premise centered on care expressed through action.
- Five progressively enhanced intake steps; three vehicle sizes and three service cards, explicit recommendation choice, quote-only protection, optional unselected logistics, Clear answer, one shared location, and required name/email/phone/vehicle/area checked server-side.
- Native form controls provide size/service choices without JavaScript. Internal navigation retains the current origin instead of forcing a staging visitor onto production.
- Founding Member eligibility checks prior requests by email and normalized phone. Migration 0014 adds a unique phone claim. Plan creation reserves the claim atomically, revisions reuse the same request claim, and newly approving inactive Care Key discounts is rejected. Agreed historical prices remain snapshots.
- Offer text advertises only the active 10% campaign. Private plan approval and public messaging terms agree. Offers do not stack.
- The former spin-for-reward/SMS campaign UI and its unmounted management panels are removed. Its API remains fail-closed; archived campaign tables and historical contact records are retained.
- Owner text and variable editing requires an owner-only preview, editing mode, and a confirmed desktop viewport. API owner/origin checks and private draft/public content separation remain enforced.
- Request care again starts a fresh request without exposing past vehicle information. The preparation template contains only agreed responsibilities and cannot be published with its placeholders intact.
- Ask WIWW is a constrained, curated-answer assistant. It uses management-confirmed answers and a personal inquiry fallback. It does not call a generative model or third-party service and cannot invent an answer.

### Evidence and limits

Automated checks: all nine standalone scripts, TypeScript, ESLint with zero warnings, public server-rendered HTML assertions (framework image stub), full migration application to fresh SQLite, and production build.

Browser tests remain unverified: real viewport geometry, visual stacking, keyboard/touch interaction, actual authentication redirects, and storage lifecycles in a live browser. A passing render or mock route test is not a passing browser test.

The invitation is scheduled after 3000 ms; browser scheduling may delay rendering. Successful booking suppresses it with browser-local storage/cookies, including native form success. Clearing browser data or switching browser/origin resets that preference. Neither timing nor device-local suppression is an absolute/permanent guarantee.

No customer messages are sent automatically. No production seed data or test requests are inserted by this release.


## Universal identity and preference correction

- The dark theme is the default, not a restriction on users. Both desktop and mobile headers offer Light/Dark switching. The saved preference is restored before paint, synchronized across tabs, and optional storage failure does not break the switch. Light mode has its own matching typography, form, step, help-panel, invitation and sunrise-art styling. Native-form error pages also restore the preference.
- The sole deeper statement is: “I am you. You are me. We are we. You are whut i wuld wunt.” It is displayed on four lines. Website-copy normalization removes the former gendered formulation from saved copy without rewriting customer records.
- Offer eligibility follows the approved first-time-client OR first-time-phone-entry rule, with one approved credit per phone. Previously recorded email or phone matches are recognized; changing formatting or email does not reset an existing phone claim.
- The question panel accepts typed questions and returns only curated, approved answers or a fallback beginning with the core question. It uses no external model or third-party script and makes no claim to generate unrestricted AI answers.
- Exact preparation-template and profile-warning wording is enforced. Existing agreed Care Plans and the private-draft publication boundary remain intact.

Automated evidence includes twelve scripts, both header controls, preference initialization and switching, storage exceptions, cross-tab events, universal saved-copy normalization, theme color contrast, offer-eligibility agreement, server-rendered public HTML, lint, TypeScript and production build. Live browser geometry, timing, authentication interaction and touch behavior remain unverified.
