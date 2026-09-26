# Audit implementation coverage

| Audit item | Implementation | Remaining work / limit |
|---|---|---|
| S1 calculation safety | Pure functions, empty numeric entry, bounds, invalid-result rejection, lidocaine caps and supported scope | Independent clinical fixtures and native validation |
| S2 crisis/anticoag sources | Source-linked MH/LAST/anaphylaxis/reversal corrections; anticoagulation scenario workflow | Full anticoag rules engine withheld; independent clinical approval |
| S3 airway/pediatrics | Unassessed airway review, complete-answer STOP-Bang, pediatric preparation prompts | Pediatric sizing and prescribing not released |
| S4 session/save integrity | Awaited serialized saves; separate preparation and crisis sessions; stale-date warning; new-session confirmation | Real-device interruption/clock behavior verification |
| S5 experience integrity | Facts rather than mutable counters; age zero; overlapping categories; distinct procedure counts; edit/delete recomputation | Program must validate credit, open intracerebral proportion and rotation-month requirements |
| S6 claims/privacy | Accurate in-app/README/privacy copy; unneeded permissions/SDK dependencies removed | Native artifact/network/backup audit remains |
| S7 shared UI | Theme tokens, scalable text, 48+ point buttons, labeled numeric fields, checked/expanded state, responsive content width | Real-device VoiceOver/TalkBack and extreme Dynamic Type |
| S8 discovery | Stable canonical routes, legacy shortcuts, bundled search, aliases, typo matching, favorites/recents | Larger clinically reviewed catalog |
| S9 conversions | Dose/rate, concentration, dilution, weight/height conversion; explicit units and formulas | Independent pharmacy acceptance fixtures |
| S10 local data | Versioned envelopes, serialized writes, validated import, collision rejection, backups/recovery, all history | Encrypted storage / cloud architecture not claimed |
| S11 Case Prep | Eight linked Quick/Learn preparation prompt guides and personal checklists | Resident/attending usability review and deeper clinical authoring |
| S12 specialty depth | Reversal, regional-anticoag scenario, pediatric preparation, ventilation/hemodynamic arithmetic | Expert-reviewed dosing/sizing, regional technique modules, acid-base algorithms remain future content |
| S13 personalization | Role/theme/reading depth, favorites/recents, experience gaps and local notes | Longitudinal learning curriculum and rotation-aware goals remain future work |
| S14 future institution/sync | Personal local institution notes | Identity, cloud conflict resolution, approved/signed institutional packs deliberately not implemented |
| S15 future native surfaces | Stable deep links | Widgets, Shortcuts, Watch and Live Activities require separate workflow/privacy/native design |

## Migration and rollback

The new `gas:cases:v1` store reads legacy `anesthesia_case_logs` once. It preserves the original key, preserves age zero, and marks migrated records as needing reconciliation. Previous requirement counters are not trusted or imported as facts. Legacy free text stays in the preserved original and should be reviewed for identifying information. Invalid legacy data blocks case editing, but not reference access; use raw export and explicit recovery.

Each update writes the previous raw envelope before committing new data. Failed writes do not publish success. Restore/reset preserves current raw bytes in a timestamped recovery key; raw export includes these keys. JSON case import merges identical records and refuses conflicting IDs without partial writes. CSV escapes quotes and leading formula characters. Native export uses the system share sheet with text; native file-based import/export is not implemented.

The old app ignores the new keys: rolling back code does **not** carry newly entered cases back into the old app. Export backups before rollback. This is local single-app state; simultaneous edits from multiple web tabs/processes are not coordinated.
