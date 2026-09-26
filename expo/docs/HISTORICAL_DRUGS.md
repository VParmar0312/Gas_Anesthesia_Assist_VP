# Historical drug field inventory

PR #1 names and IDs are audit identifiers only: its numeric IDs were reused for different drugs by the baseline. Never migrate favorites by PR #1 numeric IDs. Current PR #4 canonical IDs stay unchanged. Historical dose, onset, duration, notes, mechanism, pediatrics, contraindications and interactions remain available in git at `728687e:mocks/drugs.ts`; unsupported text is not copied into the clinical bundle.

| PR #1 ID | Name | Category | Refurbishment disposition |
|---|---|---|---|
| 1 | Propofol | Induction | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 2 | Etomidate | Induction | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 3 | Ketamine | Induction | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 4 | Midazolam | Sedation | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 5 | Dexmedetomidine | Sedation | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 6 | Lorazepam | Sedation | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 10 | Fentanyl | Opioid | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 11 | Sufentanil | Opioid | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 12 | Remifentanil | Opioid | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 13 | Morphine | Opioid | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 14 | Hydromorphone | Opioid | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 15 | Alfentanil | Opioid | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 16 | Methadone | Opioid | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 17 | Meperidine (Demerol) | Opioid | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 20 | Succinylcholine | Neuromuscular Blocker | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 21 | Rocuronium | Neuromuscular Blocker | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 22 | Cisatracurium | Neuromuscular Blocker | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 23 | Vecuronium | Neuromuscular Blocker | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 24 | Pancuronium | Neuromuscular Blocker | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 30 | Epinephrine | Vasopressor | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 31 | Phenylephrine | Vasopressor | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 32 | Ephedrine | Vasopressor | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 33 | Vasopressin | Vasopressor | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 34 | Norepinephrine | Vasopressor | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 35 | Dobutamine | Inotrope | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 36 | Milrinone | Inotrope | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 40 | Labetalol | Antihypertensive | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 41 | Esmolol | Antihypertensive | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 42 | Hydralazine | Antihypertensive | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 43 | Nicardipine | Antihypertensive | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 44 | Clevidipine | Antihypertensive | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 45 | Nitroglycerin | Cardiovascular | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 46 | Sodium Nitroprusside | Cardiovascular | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 50 | Amiodarone | Antiarrhythmic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 51 | Lidocaine (IV) | Antiarrhythmic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 52 | Adenosine | Antiarrhythmic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 53 | Atropine | Anticholinergic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 54 | Metoprolol (IV) | Antihypertensive | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 60 | Neostigmine | Reversal | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 61 | Sugammadex | Reversal | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 62 | Flumazenil | Reversal | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 63 | Naloxone | Reversal | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 64 | Idarucizumab (Praxbind) | Reversal | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 70 | Sevoflurane | Volatile | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 71 | Desflurane | Volatile | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 72 | Isoflurane | Volatile | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 73 | Nitrous Oxide | Volatile | Preserve current source reconciliation; rich fields pending unless explicitly reconciled |
| 80 | Ondansetron | Antiemetic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 81 | Dexamethasone | Antiemetic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 82 | Metoclopramide | Antiemetic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 83 | Droperidol | Antiemetic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 84 | Scopolamine (Patch) | Antiemetic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 85 | Promethazine | Antiemetic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 90 | Tranexamic Acid (TXA) | Hemostatic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 91 | Protamine | Hemostatic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 92 | Desmopressin (DDAVP) | Hemostatic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 93 | Calcium Chloride | Emergency | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 94 | Sodium Bicarbonate | Emergency | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 95 | Magnesium Sulfate | Emergency | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 96 | Dantrolene | Emergency | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 97 | Intralipid 20% | Emergency | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 100 | Ketorolac | Analgesic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 101 | Acetaminophen IV (Ofirmev) | Analgesic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 102 | Gabapentin | Analgesic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 103 | Ketamine (analgesic) | Analgesic | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 110 | Albuterol (Salbutamol) | Bronchodilator | Searchable review-queue entry; clinical values deferred for exact label and independent review |
| 111 | Ipratropium | Bronchodilator | Searchable review-queue entry; clinical values deferred for exact label and independent review |
