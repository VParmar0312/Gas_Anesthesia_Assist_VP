import React from "react";
import { useRouter } from "expo-router";
import { Screen, Txt, Notice, Button, CitationPanel } from "../components/ui";
import { Panel, Badge } from "../components/ui/clinical";
import { labGroups } from "../content/labs";
export default function Labs() {
  const router = useRouter();
  return (
    <Screen
      title="Labs & interpretation"
      subtitle="Start with the sample. Keep the context."
      back
    >
      <Badge label="ADULT REFERENCE DRAFT" tone="blue" />
      <Notice>
        Source reconciliation is not independent clinical approval. Ranges are
        laboratory-specific examples, not treatment thresholds. Use the actual
        laboratory report and local escalation pathway for urgent results.
      </Notice>
      <Panel
        title="ABG, one step at a time"
        subtitle="pH → components → compensation → gap → oxygenation"
        tone="teal"
        icon="activity"
      >
        <Txt>Explicit inputs, visible formulas, and room for uncertainty.</Txt>
        <Button
          title="Open ABG interpretation"
          onPress={() => router.push("/library/abg")}
        />
      </Panel>
      {labGroups.map((g) => (
        <Panel
          key={g.id}
          title={g.title}
          subtitle={g.tests}
          tone={g.tone}
          icon="lab"
        >
          <Txt bold size={13}>
            REFERENCE INTERVAL
          </Txt>
          <Txt>{g.range}</Txt>
          <Txt bold size={13}>
            INTERPRETATION
          </Txt>
          <Txt>{g.interpretation}</Txt>
          <Txt bold size={13}>
            LIMITATIONS
          </Txt>
          <Txt muted>{g.limitation}</Txt>
          {g.id === "coagulation-labs" && (
            <Button
              title="Review anticoagulation scenario"
              subtle
              onPress={() => router.push("/library/anticoag")}
            />
          )}
          <CitationPanel ids={g.sourceIds} />
        </Panel>
      ))}
    </Screen>
  );
}
