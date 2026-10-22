# WIWW Care Reveal integration

Integrated against authoritative V68 source commit `504596d3a708a0a3a38ebb2ba43428be033c7e1e` on 2026-10-20 (America/Los_Angeles).

## Changes

- Applied the supplied Care Reveal patch: optional three-stage service explanations, homepage discovery links, selected-service handoff, location review guidance and returning-client entry.
- Renamed the exterior service to Essential Exterior while retaining the historical intake alias.
- Corrected booking step navigation to respect reduced-motion preferences, including service-card handoff.
- Preserved service prices, package calculations, brand assets, database migrations, existing agreements and request/review/confirmation behavior.

## Validation

- Full TypeScript check passed (`tsc --noEmit --incremental false`).
- ESLint passed with no errors or warnings.
- All 15 standalone regression suites passed, including isolated in-memory database tests for content publishing/restoration, Care Plans, operations, permissions, intake and historical amounts.
- Production build passed through the Sites build helper.
- No production database records were changed and no customer messages were sent.

## Release status

Save as an unpublished version. Browser control is unavailable in this managed execution environment. The customer and authenticated owner browser checks required by RELEASE-GATES.md remain unverified, including mobile layouts, keyboard/touch behavior, both themes, the visual editor, draft/publish separation and restore in an isolated staging database. Automated tests are not a substitute for those checks. Existing live V68 remains in place until those release gates pass.
