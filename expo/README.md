# Gas Anesthesia — clinical companion review build

Expo / React Native app with five workspaces: Home, Prepare, Tools, Library and Crisis. **This branch is a review build, not a clinically approved release.** Source reconciliation is distinct from independent clinical validation.

## Run

Requires Node 22 and npm. From this directory:

```sh
npm ci
npm run start
npm run start-web
npm run check
npm run export:web
```

`npm run check` runs TypeScript, ESLint (zero warnings), 33 regression tests and content-schema checks. `npx expo export --platform all` bundles web, iOS and Android; it does not build/sign native binaries or prove native runtime behavior. `npm run release:check` intentionally fails while clinical approvals are missing or expired.

## Implemented

- Ten scoped arithmetic tools, including body size, blood loss, lidocaine label ceilings, infusion conversion, dilution, concentration, measurements, ventilation and hemodynamics. Inputs start empty; results clear on change. No hidden pediatric age, universal LA maximum, automatic NPO replacement or negative-result clamping.
- Eight procedure preparation guides with Quick/Learn views, personal checklists and related references.
- Category-colored drug detail screens with dedicated dosing, mechanism, onset/duration and expandable safety sections. Propofol has a representative exact-product reconciliation; unsupported fields remain explicit review gaps. Forty-four historical agents remain discoverable in a monograph review queue.
- Twenty-three source-linked medication references with indication/population/route context; entries distinguish selected label values from regimens requiring the full label.
- Seven crisis reference workflows, persisted event start/progress, formulation-specific MH arithmetic and explicit new-event confirmation. Timers measure wall-clock elapsed time; they are not drug alarms.
- Offline in-app search with aliases, typo tolerance, filters, favorites and recents. Native content is bundled; external source links require connectivity. Web offline cold launch is not implemented as a PWA.
- Airway review with unassessed states and a separate complete-answer adult STOP-Bang screen. Pediatric preparation and anticoagulation scenario checklists explicitly withhold unvalidated sizing/timing outputs.
- Labs & Interpretation: six lab groups with scoped selected adult intervals; an explicit-input adult ABG worksheet with user-selected compensation model, optional chemistry anion gap, albumin correction, delta ratio and P/F arithmetic. Results clear on edits and never prescribe treatment.
- Room preparation sessions, stale-day warnings, reset confirmation and reusable local items.
- Case facts with age in completed months (including zero), multiple techniques/qualifying experiences, distinct procedure counts, derived ACGME experience totals, legacy reconciliation, all-history search, edit, delete/undo, CSV export and validated JSON merge/import.
- A separate saved pediatric preparation context preserves zero months, measured weight, timestamp and checks; changed context clears checks. No unreviewed pediatric size/dose output.
- Semantic colored dashboard, accessible progress, recent searches, increased contrast and reduced-motion navigation across all stacks.
- Light/dark/system appearance, resident/attending home, reading-depth preferences and personal institution notes.
- Serialized local persistence, backup-before-write, validation, explicit recovery and raw export. Original legacy keys are preserved. AsyncStorage is not encrypted.

## Architecture

`app/` contains routes; `components/ui/` holds accessible controls and color tokens; `content/` contains versioned source-linked data and scope; `features/` holds reusable workflows; `services/` owns local persistence, export and search; `utils/` contains pure arithmetic. There is one state owner per stored domain. Reference access does not depend on case-log health.

The previous unused location/image-picker and Rork SDK dependencies were removed. The npm lockfile is the dependency authority; the stale Bun lockfile is removed. Package and app permissions still require review of the actual native artifact.

## Clinical and release work

See the [historical parity matrix and roadmap](docs/REFURBISHMENT.md), [67-drug historical inventory](docs/HISTORICAL_DRUGS.md), [clinical review requirements](docs/CLINICAL_REVIEW.md), [implementation coverage](docs/IMPLEMENTATION.md) and [verification](docs/VERIFICATION.md). No cloud sync, signed institution packs, automatic clinical updating, widgets, Watch app or autonomous patient-specific recommendations are implemented.

Do not add patient identifiers to cases, notes, backups, screenshots or bug reports. Keep production distribution blocked until clinical review and real-device release verification are complete.
