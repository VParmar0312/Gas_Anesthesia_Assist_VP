import { Panel } from "../../../components/ui/clinical";
import React, { useState } from "react";
import {
  Screen,
  Txt,
  Choice,
  Notice,
  Result,
  CitationPanel,
  Button,
} from "../../../components/ui";
import { stopBang } from "../../../utils/calculations";
const domains = [
  "Prior difficulty with mask ventilation or intubation",
  "Mouth opening",
  "Mallampati class",
  "Thyromental distance",
  "Neck movement",
  "Dentition and airway pathology",
  "Aspiration risk and apnea tolerance",
];
const questions = [
  "Snoring loudly",
  "Often tired or sleepy during daytime",
  "Observed apnea during sleep",
  "High blood pressure or treatment",
  "BMI greater than 35 kg/m²",
  "Age older than 50 years",
  "Neck circumference greater than 40 cm",
  "Male sex (published model)",
];
export default function Airway() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(
      Array(8).fill(null),
    ),
    [assessment, setAssessment] = useState<Record<string, string>>({});
  const result = stopBang(answers);
  return (
    <Screen title="Airway & OSA assessment" back>
      <Notice>
        No combined difficult-airway score is calculated. An individual concern
        can be significant; normal findings do not rule out difficulty.
      </Notice>
      <Panel
        title="Airway observations"
        subtitle="Assessment, not an aggregate risk score"
        tone="amber"
        icon="airway"
      >
        {domains.map((label) => (
          <Choice
            key={label}
            label={label}
            options={[
              "Unassessed",
              "No concern identified",
              "Concern identified",
            ]}
            value={assessment[label] ?? "Unassessed"}
            onChange={(v) => setAssessment((a) => ({ ...a, [label]: v }))}
          />
        ))}
      </Panel>
      <Txt>
        Agree on primary and backup approaches, oxygenation, help and rescue
        resources. This screen does not select a technique.
      </Txt>
      <Panel
        title="Adult STOP-Bang screening"
        subtitle="A separate OSA screening model"
        tone="blue"
        icon="activity"
      >
        <Txt muted>
          Answer all eight questions. Unanswered is not “No.” This screens for
          OSA, not difficulty with intubation.
        </Txt>
        {questions.map((label, i) => (
          <Choice
            key={label}
            label={label}
            options={["Unanswered", "Yes", "No"]}
            value={
              answers[i] === null ? "Unanswered" : answers[i] ? "Yes" : "No"
            }
            onChange={(v) =>
              setAnswers((a) =>
                a.map((x, j) =>
                  i === j ? (v === "Unanswered" ? null : v === "Yes") : x,
                ),
              )
            }
          />
        ))}
        {result ? (
          <Result
            label="OSA screening result"
            value={`${result.score} / 8`}
            detail={
              result.risk +
              "; not a diagnosis. Apply local referral and perioperative planning pathways."
            }
          />
        ) : (
          <Notice>Incomplete assessment — no score displayed.</Notice>
        )}
      </Panel>
      <Button
        title="Clear assessment"
        subtle
        onPress={() => {
          setAnswers(Array(8).fill(null));
          setAssessment({});
        }}
      />
      <CitationPanel ids={["stop", "das"]} />
    </Screen>
  );
}
