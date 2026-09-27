# Clinical review and content governance

Content version: `2026.09.26-rc2`. Status: **draft — independent clinical review pending**.

The engineering/source reconciliation is not clinical approval. `content/sources.ts` records primary references and access dates; `content/drugs.ts`, `content/crises.ts` and `content/tools.ts` separate scope from values. `content/review.ts` deliberately has no invented reviewer or approval dates. `npm run release:check` fails until each entry has a named authorized reviewer, valid approval/review dates and version-matched acceptance fixtures.

## Source-confirmed changes to review

| Area | Change | Primary evidence |
|---|---|---|
| Lidocaine | Adult scope, 300/500 mg caps, no repeated/mixed-agent output, concentration and downward volume rounding | DailyMed selected lidocaine injection label (`lidocaine`) |
| MH | 2.5 mg/kg initial arithmetic, separate 20 mg/60 mL and 250 mg/5 mL formulations; no hard 10 mg/kg maximum | MHAUS crisis guidance (`mh`) |
| LAST | 2–3 minute lipid bolus, continuation after stability, cumulative lipid limit; modified resuscitation cautions | ASRA 2020 v1.1 checklist (`last`) |
| Anaphylaxis | UK RCUK specialist context, explicit IV/IM distinction, no ranitidine, follow-up sampling/referral context | RCUK 2024 (`rcuk`) |
| Reversal | Sugammadex agent/depth/actual-weight context and renal/contraception caveats; no fixed “complete” recovery claim | Merck March 2026 label (`bridion`) |
| Propofol rich facts | Exact Avet/Heritage IV 10 mg/mL EDTA product; selected induction populations; dedicated mechanism/onset/context, pediatric indications/exclusions, contraindications, interactions and monitoring | DailyMed setID `10272dc1-657d-4798-a34a-b6341b92e560`, SPL 14 effective 2025-05-26 (`label-propofol`) |
| Labs / ABG | Selected adult laboratory intervals and explicit educational compensation/gap/oxygen arithmetic; no autonomous diagnosis or clinical thresholds | Mayo RFAMA/CBC, Merck Manual acid-base revision April 2025, Figge et al. PMID 9824071 |
| Drug references | Selected exact-label context replaces a universal bolus/onset/duration table; product differences retained | Individual product/source records in `content/drugs.ts` |
| Airway | No unsupported aggregate difficult-airway score; unanswered STOP-Bang questions cannot count negative | Published STOP-Bang pathway (`stop`) |
| ACGME | Experience-specific minimums, pediatric overlap, separate procedure counts, no total-600 requirement | July 2026 requirements (`acgme`) |

## Deliberately unavailable outputs

- Pediatric airway device sizing and pediatric drug recommendations: require pediatric/device-specific review, including neonates, prematurity and age limits.
- A complete neuraxial/deep-block antithrombotic interval engine: the new scenario checklist captures the required context, but does not issue a go/no-go or restart time. Review drug/dose categories, renal exceptions, catheter events, traumatic puncture and concurrent agents before implementing rules.
- Other local-anesthetic “maximum” calculators, mixed-agent budgets and repeat-dose budgets: no universal numeric rule is supplied.
- Universal NPO deficit replacement, emergence-time predictions, fixed hemorrhage ratios/TXA regimen, abbreviated surgical-airway or needle-decompression instructions: removed instead of claiming universal applicability.

## Approval process

1. Assign an accountable anesthesiologist and pharmacy/domain reviewer for each affected clinical area.
2. Reconcile the **exact** product/guideline revision, population, units, route, indication, exclusions and clinical actions. Source access dates are not publication dates or guarantees of latest guidance.
3. Independently produce clinical fixtures for normal, boundary, invalid and unsupported scenarios; engineering tests currently establish the encoded behavior, not independent clinical truth.
4. Confirm attribution and distribution rights before bundling any full external algorithm/figure. This build contains concise summaries and links, not copies of the full copyrighted algorithms.
5. Record reviewer, dates, version and next review deadline in `content/review.ts` through a reviewed change. Replace the global draft banner only when a release has actually been approved.
6. Run the engineering checks plus real-device offline, accessibility, interruption and timer checks listed in `VERIFICATION.md`.

Procedure guides are preparation **prompts** for discussion. A general monitoring source does not substantiate a procedure-specific protocol; expand them only with domain-reviewed evidence. Local institution notes are user-authored personal notes, not approved or signed institutional packs.

## Field and release validation

`npm run content:check` validates unique catalog/review IDs, source metadata, citations, related links, review versions, tool bounds/units and new clinical fact scope. `factProblems` rejects absent population, route, formulation, context/source section and unsupported dose units; dosing facts also require weight basis, indication and titration. Existing selected monograph paragraphs retain their scoped source reconciliation, but conversion of every legacy paragraph into this field-level model is still pending.

`authorizedReviewers` and `clinicalAcceptanceFixtures` deliberately start empty. An approval must reference an authorized name and nonempty fixtures matching content ID/version and reviewer, with expected outcome/description. Invalid, future or expired review dates block release. All 110 entries currently fail clinical release. The 33 engineering tests (including hand-calculated arithmetic examples) are not independent clinician/pharmacist acceptance fixtures.

Forty-four historical agents, additional local-anesthetic products, MAC/age values, PONV scoring, antimicrobial prophylaxis and opioid-equivalence regimens remain discoverable but numerically unavailable. Pediatric/device tables and antithrombotic timing remain withheld. Link verification/source reconciliation does not imply a current, institution-adopted protocol.
