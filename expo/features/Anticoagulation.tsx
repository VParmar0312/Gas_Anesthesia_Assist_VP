import React, { useState } from "react";
import {
  Screen,
  Heading,
  Txt,
  Choice,
  Field,
  Notice,
  Check,
  CitationPanel,
  Button,
} from "../components/ui";
/** Captures the guideline branch without fabricating a complete anticoagulation rules engine. */
export default function Anticoagulation() {
  const [drug, setDrug] = useState(""),
    [dose, setDose] = useState(""),
    [renal, setRenal] = useState(""),
    [event, setEvent] = useState(""),
    [block, setBlock] = useState(""),
    [catheter, setCatheter] = useState(""),
    [reviewed, setReviewed] = useState(false),
    [show, setShow] = useState(false);
  const change = (set: (s: string) => void) => (value: string) => {
    set(value);
    setShow(false);
    setReviewed(false);
  };
  return (
    <Screen title="Anticoagulation & regional anesthesia" back>
      <Notice>
        Scenario checklist for the ASRA fifth-edition guideline. This build does
        not calculate permission to perform a block or restart a drug.
      </Notice>
      <Choice
        label="Planned technique"
        value={block}
        onChange={change(setBlock)}
        options={["Neuraxial", "Deep plexus / peripheral", "Other / uncertain"]}
      />
      <Field
        label="Antithrombotic drug"
        value={drug}
        onChange={change(setDrug)}
      />
      <Field
        label="Dose, schedule and indication"
        value={dose}
        onChange={change(setDose)}
      />
      <Field
        label="Renal function and how it was assessed"
        value={renal}
        onChange={change(setRenal)}
      />
      <Choice
        label="Event being considered"
        value={event}
        onChange={change(setEvent)}
        options={[
          "Needle placement",
          "Catheter removal",
          "Postoperative restart",
        ]}
      />
      <Choice
        label="Catheter status"
        value={catheter}
        onChange={change(setCatheter)}
        options={[
          "No catheter",
          "Catheter in situ",
          "Catheter removed",
          "Uncertain",
        ]}
      />
      <Check
        label="I reviewed last administration, other antithrombotics, bleeding risk and traumatic puncture with the responsible team."
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
      {show &&
        (!drug.trim() ||
        !dose.trim() ||
        !renal.trim() ||
        !event ||
        !block ||
        !catheter ||
        !reviewed ? (
          <Notice error>
            Complete each field and context check. An incomplete scenario cannot
            select a guideline branch.
          </Notice>
        ) : (
          <>
            <Heading>Scenario to match to the guideline</Heading>
            <Txt>
              {drug} • {dose}
            </Txt>
            <Txt>
              {block} • {event} • {catheter}
            </Txt>
            <Txt>Renal assessment: {renal}</Txt>
            <Notice>
              No timing recommendation generated. Locate the matching drug and
              low/high-dose category, then the specific event. Placement,
              removal and restart intervals are not interchangeable. Verify the
              locally adopted version and exceptions.
            </Notice>
          </>
        ))}
      <Txt muted>
        Entries are temporary and are cleared when this screen is left. Do not
        include patient identifiers.
      </Txt>
      <CitationPanel ids={["asra"]} />
    </Screen>
  );
}
