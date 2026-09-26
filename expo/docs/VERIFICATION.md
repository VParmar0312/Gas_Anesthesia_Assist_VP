# Verification record

Engineering verification is separate from clinical approval.

## Automated

- `npm run check`: TypeScript, zero-warning ESLint, and regression tests pass locally.
- Regression coverage: normal/high-weight lidocaine caps; invalid exposure; concentration/infusion/dilution units; blood-loss/Hct direction; body-size domains; strict parsing; dantrolene formulations; STOP-Bang unanswered/combination pathways; concurrent writes; failed disk saves; corruption preservation; backup recovery; explicit recovery without prior backup; legacy age zero; derived overlapping/procedure credits; import collisions; CSV injection escaping; search ranking/typos; content/source/related-link integrity; deep-link preservation; review release gate; very small positive outputs.
- `expo export --platform all`: web, iOS Hermes and Android Hermes bundles produced locally. This is **not** an installed native app test.
- `npm run release:check`: expected failure while draft entries have no clinical approval.

## Browser smoke checks

Local production web bundle, synthetic data only:

- Cold launch reaches Home with five tabs; canonical paths avoid the prior ambiguous grouped-index routes.
- Lidocaine starts without a weight or result; blank Calculate shows an error.
- 70 kg / 1% / no epinephrine / confirmed applicable scope shows 300 mg and 30 mL.
- Editing the weight clears the result and scope confirmation.
- Zero-month synthetic case saves as zero, increments all three pediatric categories, and appears after navigation.
- Delete confirmation recomputes pediatric counts to zero and exposes Undo; Undo persists after a full reload.
- MH event start, action acknowledgement and elapsed time persist after reload; patient weight/formulation/result do not persist. Synthetic 70 kg / Ryanodex produces 175 mg, one vial, 5 mL sterile water per vial.
- Brand alias “Bridion” resolves to Sugammadex; favoriting survives reload; source/version/review status expands correctly.
- Preparation checks survive reload; confirmed new session clears checks and remains cleared after reload.
- Responsive dark layout inspected at 390 × 844 and wider browser size. Native accessibility validation remains outstanding.

## Dependency audit (2026-09-26)

`npm audit` reports 17 findings: 16 moderate, one high, zero critical. The PostCSS override to 8.5.28 removes its high-severity advisory. The remaining high finding is `image-size` through Metro's asset pipeline (GHSA-5p2g-fcmc-qvqq). Metro 0.83.3 uses the old filename/default-export API; blindly overriding to image-size 2.x would break that interface. A compatible Expo/Metro update or reviewed backport, followed by native/build validation, remains required. The current app has no user image-upload pipeline, but that does not make the dependency finding resolved.

## Required before production distribution

- Clinician/pharmacy approval of each clinical change and independent expected-value fixtures.
- Install on supported iPhone/iPad/Android devices; test offline cold startup, deep links, background/resume/kill, low storage, migration and export/import.
- VoiceOver/TalkBack focus and announcements; maximum Dynamic Type, light/dark contrast and landscape/tablet layout.
- Crisis progress and wall-clock timers across backgrounding, time changes and new events; no reliance on app timers as clinical alarms.
- Inspect the final signed native binary for permissions, linked SDKs, network activity and OS backup behavior. AsyncStorage is unencrypted.
- Verify all current source URLs and adopted local algorithm versions. External links require connectivity; retain full approved emergency algorithms in the workplace.
- Assess multi-tab/process writes if web becomes a supported deployment; this build serializes within one app process only.
