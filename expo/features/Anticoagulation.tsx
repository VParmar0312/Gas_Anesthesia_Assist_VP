import React, { useState } from "react";
import {
  Screen,
  Txt,
  Choice,
  Field,
  Notice,
  Check,
  CitationPanel,
  Button,
} from "../components/ui";
import { Panel, Badge } from "../components/ui/clinical";
import {
  antithrombotics,
  emptyScenario,
  scenarioMissing,
  anticoagEvents,
  AnticoagScenario,
} from "../content/anticoagulation";
export default function Anticoagulation() {
  const [scenario, setScenario] = useState({ ...emptyScenario }),
    [reviewed, setReviewed] = useState(false),
    [show, setShow] = useState(false);
  const change = (key: keyof AnticoagScenario) => (value: string) => {
    setScenario((s) => ({ ...s, [key]: value }));
    setShow(false);
    setReviewed(false);
  };
  const drug = antithrombotics.find((d) => d.name === scenario.drug);
  return (
    <Screen
      title="Anticoagulation"
      subtitle="A specific drug. A specific event. A complete context."
      back
    >
      <Badge label="REGIONAL ANESTHESIA · ASRA FIFTH EDITION" tone="purple" />
      <Notice>
        Guided source-review checklist. Numeric timing remains unavailable
        pending exact-source reconciliation and independent clinical review.
        This screen cannot clear a block or a restart.
      </Notice>
      <Panel title="1 / Medication & dose context" icon="pill" tone="purple">
        <Choice
          label="Antithrombotic"
          value={scenario.drug}
          onChange={change("drug")}
          options={antithrombotics.map((d) => d.name)}
        />
        {drug && (
          <>
            <Badge label={drug.class} tone="purple" />
            <Txt muted>{drug.aliases}</Txt>
          </>
        )}
        <Field
          label="Exact product, route, dose, schedule and indication"
          value={scenario.dose}
          onChange={change("dose")}
        />
        <Choice
          label="Dose category to verify against guideline"
          value={scenario.doseClass}
          onChange={change("doseClass")}
          options={[
            "Low / prophylactic",
            "High / therapeutic",
            "Uncertain — verify",
          ]}
        />
        <Txt muted size={13}>
          Indication alone does not establish a guideline dose category.
        </Txt>
      </Panel>
      <Panel title="2 / Timing & patient modifiers" icon="clock" tone="amber">
        <Field
          label="Last administration date, time and time zone (or unknown)"
          value={scenario.lastDose}
          onChange={change("lastDose")}
        />
        <Field
          label="Renal function, units, assessment method and date"
          value={scenario.renal}
          onChange={change("renal")}
        />
        <Field
          label="Other antithrombotics, bleeding risks and traumatic puncture (or none known)"
          value={scenario.modifiers}
          onChange={change("modifiers")}
          multiline
        />
      </Panel>
      <Panel title="3 / Procedure & catheter" icon="layers" tone="blue">
        <Choice
          label="Technique"
          value={scenario.technique}
          onChange={change("technique")}
          options={[
            "Neuraxial",
            "Deep plexus / peripheral",
            "Other / uncertain",
          ]}
        />
        <Choice
          label="Event"
          value={scenario.event}
          onChange={change("event")}
          options={anticoagEvents}
        />
        <Choice
          label="Catheter status"
          value={scenario.catheter}
          onChange={change("catheter")}
          options={[
            "No catheter",
            "Catheter in situ",
            "Catheter removed",
            "Uncertain",
          ]}
        />
      </Panel>
      <Check
        label="I reviewed this scenario with the responsible team; uncertain fields still require resolution."
        checked={reviewed}
        onPress={() => {
          setReviewed(!reviewed);
          setShow(false);
        }}
      />
      <Button
        title="Summarize scenario for source review"
        onPress={() => setShow(true)}
      />
      <Button
        title="Reset scenario"
        subtle
        onPress={() => {
          setScenario({ ...emptyScenario });
          setReviewed(false);
          setShow(false);
        }}
      />
      {show &&
        (scenarioMissing(scenario).length || !reviewed ? (
          <Notice error>
            Complete each context field and the team review check. Use “unknown”
            when information is unavailable; this never permits a timing
            recommendation.
          </Notice>
        ) : (
          <Panel title="Scenario for discussion" tone="teal" icon="check">
            <Txt bold>
              {scenario.drug} · {drug?.class}
            </Txt>
            <Txt>
              {scenario.dose} · {scenario.doseClass}
            </Txt>
            <Txt>
              {scenario.technique} · {scenario.event} · {scenario.catheter}
            </Txt>
            <Txt>Last administration: {scenario.lastDose}</Txt>
            <Txt>Renal assessment: {scenario.renal}</Txt>
            <Txt>Modifiers: {scenario.modifiers}</Txt>
            <Badge label="TIMING NOT GENERATED" tone="amber" />
          </Panel>
        ))}
      <Panel title="Pre-procedure hold" tone="amber" icon="clock">
        <Txt>
          Pending review. Match the exact drug, low/high-dose category, renal
          context and technique before consulting the interval. An unknown last
          dose remains unresolved.
        </Txt>
      </Panel>
      <Panel title="Catheter events" tone="purple" icon="layers">
        <Txt>
          Placement and removal are separate events. Verify in-situ
          administration and the sequence of doses and catheter manipulation in
          the exact guideline branch.
        </Txt>
      </Panel>
      <Panel title="Postoperative restart" tone="green" icon="clock">
        <Txt>
          Pending review. Verify surgical hemostasis, procedure bleeding risk
          and catheter-event context separately. A pre-procedure hold interval
          cannot be used as a restart interval.
        </Txt>
      </Panel>
      <Panel title="Laboratory considerations" tone="blue" icon="lab">
        <Txt>
          Ask which assay is applicable, its units, calibration and sample
          timing. This build does not infer absent drug effect from an ordinary
          coagulation result or supply a universal “safe” laboratory threshold.
        </Txt>
      </Panel>
      <Panel title="Bridging & urgent management" tone="rose" icon="crisis">
        <Txt>
          Bridging is a separate thrombotic/bleeding-risk decision for the
          responsible specialist. Reversal is not an automatic route to
          regional-anesthesia clearance. Follow your institution’s urgent
          bleeding and reversal pathways.
        </Txt>
      </Panel>
      <Txt muted size={13}>
        Temporary scenario only; no patient identifiers. ASRA regional guidance
        is not interchangeable with interventional pain guidance or other
        jurisdictions.
      </Txt>
      <CitationPanel ids={["asra"]} />
    </Screen>
  );
}
