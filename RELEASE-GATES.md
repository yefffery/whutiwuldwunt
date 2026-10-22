# WIWW release gates

Public experience and owner operations are equal release priorities. A simpler public flow does not excuse a brittle owner workspace, and a capable dashboard does not excuse confusing customer pages.

## Required before publishing

- Test each public page and primary action from a customer perspective, including the request receipt, theme toggle, mobile navigation, and any lead-capture prompt.
- Test `/manage` in a non-production owner session against an isolated D1 database. Exercise every owner control that changes data, verify draft/published separation, and confirm revision restore without touching live records.
- The visual editor must support direct text edits and hover-based variable inspection for data-driven elements. A variable inspector must show its structured binding and affected settings, save to the private draft, preserve the published version, and survive reload. Do not treat the current Advanced controls as proof that this hover inspector is implemented.
- Check the same customer and owner flows at phone-sized viewports, including popup dismissal, keyboard access, tap targets, overflow, and form submissions.
- Keep external messaging and payments disabled until their operating rules are approved and the corresponding flows are tested.

## Verified in this checkout

- `pnpm lint` exits successfully with zero errors and zero warnings.
- `pnpm build` succeeds.
- All twelve standalone test scripts pass against in-memory SQLite/D1 adapters and pure helper checks. They cover content draft/publish/revision behavior, owner and origin checks, Care Plan state, job operations, feedback, promotion fail-closed behavior, saved theme/copy, and intake rules. They do not create live records or send messages.
- The content tests caught and now guard against saved service prices, add-ons, and labels reverting to defaults when content is loaded or published.

## Still open

- The authenticated `/manage` browser workflow and the hover-based Variable Inspector have not passed a browser test. The current canvas supports inline wording edits, while structured settings live in Advanced controls.
- This checkout's content record stores a validated structured JSON document in D1, with separate draft, published, and history fields. It does not expose each setting as an independently bound relational column.
- Physical-device and mobile-viewport testing has not been completed.
