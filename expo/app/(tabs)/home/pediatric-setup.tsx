import React, { useState } from "react";
import {
  Screen,
  Txt,
  Notice,
  Field,
  Check,
  Heading,
} from "../../../components/ui";
export default function Pediatrics() {
  const [age, setAge] = useState(""),
    [weight, setWeight] = useState(""),
    [checks, setChecks] = useState<string[]>([]);
  return (
    <Screen title="Pediatric preparation" back>
      <Notice>
        Pediatric device sizing and drug outputs are withheld pending a
        pediatric review of age boundaries, device-specific guidance and
        formulations. The previous age-only estimates were not valid for all
        infants and neonates.
      </Notice>
      <Field
        label="Age"
        unit="completed months"
        keyboard="decimal-pad"
        value={age}
        onChange={setAge}
      />
      <Field
        label="Confirmed measured weight"
        unit="kg"
        keyboard="decimal-pad"
        value={weight}
        onChange={setWeight}
      />
      <Txt muted>
        Entries stay only on this screen. Use your approved pediatric reference
        and exact equipment specifications.
      </Txt>
      <Heading>Preparation review</Heading>
      {[
        "Confirm age, gestational history where relevant, and measured weight",
        "Verify primary airway device plus adjacent sizes and rescue equipment",
        "Confirm circuit, ventilation, monitoring and warming resources",
        "Verify each drug concentration and weight-based prescription independently",
        "Discuss fasting, fluids and glucose monitoring with the pediatric team",
        "Agree on emergence, apnea monitoring and postoperative destination",
      ].map((label) => (
        <Check
          label={label}
          checked={checks.includes(label)}
          key={label}
          onPress={() =>
            setChecks((a) =>
              a.includes(label) ? a.filter((x) => x !== label) : [...a, label],
            )
          }
        />
      ))}
    </Screen>
  );
}
