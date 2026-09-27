# Verification record — 2026-09-27

Engineering verification is separate from clinical approval. Tests used isolated local browser storage and synthetic cases only.

## Commands and outcomes

| Check | Result |
|---|---|
| `npm ci` | Clean locked install passed; no new runtime dependencies |
| `npm run check` | TypeScript passed, ESLint zero warnings, **33/33 tests passed**, content schema passed |
| `npx expo export --platform all` | Web, iOS Hermes and Android Hermes exports passed after final input-focus fix |
| `node --import tsx scripts/release-check.ts` | Expected exit 1: **110 draft entries** lack authorized approval and matching acceptance fixtures |
| `git diff --check` | Passed |
| Playwright against exported web app in Chrome | Ten workflow groups passed, zero page JavaScript errors |
| Viewport sweep | 96 after captures, 28 before captures; no document horizontal overflow/page errors |

Regression coverage preserves PR #4 calculation boundaries, invalid inputs, lidocaine caps, exact dantrolene formulations, STOP-Bang unanswered/combination pathways, serialized writes, failure rollback, corruption/recovery, age zero, derived overlapping/procedure credits, import collision rejection, CSV formula escaping, search ranking/typos and canonical links. New tests cover compensation models and partial optional inputs, anion-gap chemistry versus blood gas, explicit correction references, pediatric envelope reload/validation, new fact scope/units, scenario completeness, authorized approval/fixture dates, stale checklist IDs and semantic text contrast (at least 4.5:1 for tested pairs). Arithmetic examples are engineering expectations, not independently approved clinical fixtures.

## Browser workflow coverage

1. Home → typo search → propofol, distinct sections, expanded interactions and persisted favorite.
2. Empty infusion form rejects; entered synthetic 70 kg / 0.1 mcg/kg/min / 16 mcg/mL returns 26.25 mL/h; edit invalidates; reset empties.
3. Explicit ABG entry and selected Winter model shows transparent 24–28 mmHg arithmetic; edit invalidates; reset clears.
4. Anticoagulation drug/event scenario captures unknowns; generates no timing or clearance; changing event invalidates summary.
5. Pediatric zero months / 3.2 kg and checks survive reload; measurement edits clear checks; canceled and confirmed resets work; no sizing/dose output.
6. Room checklist resumes; canceled reset preserves; confirmed reset clears.
7. Crisis event confirmed start and checked action survive reload; elapsed-time disclaimer remains; canceled new event preserves state.
8. Case create age zero / two distinct blocks derives expected credits; edit age, delete/undo, CSV formula escape, JSON duplicate merge and conflicting-ID rejection.
9. Loaded web app continues bundled alias search and reference navigation after network disabled. **No offline web cold-launch claim.**
10. Legacy zero-month case migrates, retains reconciliation flag and original storage.

## Visual and accessibility checks

[Before/after gallery and evidence](visual-review/README.md): 320 × 720, 430 × 932 and 834 × 1112, light/dark, 16 primary routes. Representative home, library, drug, anticoagulation, labs, pediatric and crisis screenshots inspected. Expanded propofol content also tested at 150% browser text size; portrait-to-landscape resize, keyboard entry and sequential field focus, increased contrast and dark ABG result inspected. Reduced-motion preference supplied; every native navigator now uses the shared reduce-motion listener.

QA found and fixed missing web progress values and loss of input focus when React Native Web's `on-drag` dismissal reacted to programmatic scrolling. Numeric ARIA values are now explicit and drag-to-dismiss applies only to native platforms. These checks do not establish native Dynamic Type, VoiceOver/TalkBack or soft-keyboard behavior.

## Dependency audit

2026-09-26: **17 findings: 16 moderate, one high, zero critical**, unchanged runtime dependency set. The remaining high `image-size` vulnerability is in Metro's asset pipeline (including GHSA-5p2g-fcmc-qvqq / GHSA-w3rx-r6r6-pgpr). The older Metro filename/default-export API prevents an unreviewed major override. A compatible SDK/Metro update or reviewed backport with build validation is still required; the lack of image uploads does not resolve it.

## Required before production distribution

- Authorized clinician/pharmacist review and independent, version-specific acceptance fixtures for each clinical area; source/version/local-algorithm adoption checks.
- Install signed builds on supported iPhone/iPad/Android devices: cold offline launch, deep links, migration, export/import, low storage, process kill/background/resume and clock changes.
- VoiceOver/TalkBack, maximum Dynamic Type, soft keyboard, contrast, tablet/landscape and performance checks on devices.
- Verify crisis elapsed time/progress lifecycle; app timers are not clinical alarms.
- Inspect actual native permissions, linked SDKs, network and OS backups. AsyncStorage is unencrypted; native share-text export has no native file-import equivalent.
- Resolve dependency findings; assess multi-process/tab writes if web is supported (serialization is within one app process).
