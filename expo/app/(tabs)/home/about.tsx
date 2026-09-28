import Recovery from "../../../features/Recovery";
import React, { useState } from "react";
import {
  Screen,
  Txt,
  Heading,
  Choice,
  Field,
  AsyncButton,
  Notice,
  Accordion,
  Button,
} from "../../../components/ui";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  preferencesStore,
  caseStore,
  useStore,
  Preferences,
} from "../../../services/data";
import { casesCsv, mergeCases } from "../../../content/cases";
import { exportText } from "../../../services/export";
import { contentVersion, reviewStatus } from "../../../content/sources";
function SettingsForm() {
  const router = useRouter();
  const { data: p, loaded, error } = useStore(preferencesStore);
  const [institution, setInstitution] = useState(p.institution),
    [contact, setContact] = useState(p.emergencyContact),
    [concentrations, setConcentrations] = useState(p.concentrations),
    [backup, setBackup] = useState(""),
    [message, setMessage] = useState(""),
    [failure, setFailure] = useState("");
  const update = (key: keyof Preferences, value: string) => {
    void preferencesStore
      .update((v) => ({ ...v, [key]: value }))
      .catch((e) => setFailure(e.message));
  };
  return (
    <Screen title="Preferences & data" back>
      {(error || failure) && <Notice error>{error || failure}</Notice>}
      <Choice
        label="Appearance"
        options={["system", "light", "dark"]}
        value={p.theme}
        onChange={(v) => update("theme", v)}
      />
      <Choice
        label="Contrast"
        options={["standard", "increased"]}
        value={p.contrast ?? "standard"}
        onChange={(v) => update("contrast", v)}
      />
      <Txt muted size={13}>
        Clinical surfaces stay opaque. Controls use static feedback; screen
        transitions respect reduced motion.
      </Txt>
      <Choice
        label="Home workspace"
        options={["resident", "attending"]}
        value={p.role}
        onChange={(v) => update("role", v)}
      />
      <Choice
        label="Default reading depth"
        options={["quick", "learn"]}
        value={p.mode}
        onChange={(v) => update("mode", v)}
      />
      <Button
        title="Open case log (all roles)"
        subtle
        onPress={() => router.push("/(tabs)/cases")}
      />
      <Heading>Local institution notes</Heading>
      <Txt muted>
        Personal notes only; not an approved institutional content pack. Verify
        their owner and currency locally.
      </Txt>
      <AsyncButton
        title="Load saved local notes into editor"
        action={async () => {
          setInstitution(p.institution);
          setContact(p.emergencyContact);
          setConcentrations(p.concentrations);
        }}
      />
      <Field
        label="Institution / location label"
        value={institution}
        onChange={setInstitution}
      />
      <Field
        label="Local emergency contact or extension"
        value={contact}
        onChange={setContact}
      />
      <Field
        label="Locally verified preparation and concentration notes"
        value={concentrations}
        onChange={setConcentrations}
        multiline
      />
      <AsyncButton
        title="Save local notes"
        action={async () => {
          if (!loaded) throw Error("Preferences still loading.");
          await preferencesStore.update((v) => ({
            ...v,
            institution: institution.slice(0, 100),
            emergencyContact: contact.slice(0, 100),
            concentrations: concentrations.slice(0, 2000),
          }));
          setMessage("Local notes saved.");
        }}
      />
      <Heading>Export & recovery</Heading>
      <Notice>
        Exports may contain sensitive information entered by the user. Review
        before sharing. Native export uses the system share sheet; choose a
        trusted destination.
      </Notice>
      <AsyncButton
        title="Export case backup (JSON)"
        action={async () => {
          await caseStore.load();
          if (caseStore.snapshot().error)
            throw Error(
              "Use raw recovery export while case storage has an error.",
            );
          await exportText(
            "gas-cases.json",
            JSON.stringify(
              {
                format: "gas-cases",
                version: 1,
                exportedAt: new Date().toISOString(),
                cases: caseStore.snapshot().data,
              },
              null,
              2,
            ),
          );
        }}
      />
      <AsyncButton
        title="Export case history (CSV)"
        action={async () => {
          await caseStore.load();
          if (caseStore.snapshot().error)
            throw Error("Use raw export while case storage needs recovery.");
          await exportText(
            "gas-cases.csv",
            casesCsv(caseStore.snapshot().data),
            "text/csv",
          );
        }}
      />
      <Accordion title="Import case backup">
        <Txt>
          Paste a JSON case backup. Matching records are deduplicated;
          conflicting IDs stop the entire import. Current records are retained.
        </Txt>
        <Field
          label="Case backup JSON"
          value={backup}
          onChange={setBackup}
          multiline
        />
        <AsyncButton
          title="Validate and merge case backup"
          action={async () => {
            const parsed = JSON.parse(backup);
            if (parsed.format !== "gas-cases" || parsed.version !== 1)
              throw Error("Unsupported backup format/version.");
            await caseStore.update((v) => mergeCases(v, parsed.cases));
            setBackup("");
            setMessage("Backup merged successfully.");
          }}
        />
      </Accordion>
      <Accordion title="Storage recovery">
        <Txt>
          Raw export preserves current and legacy data for manual recovery.
          Restoring previous data replaces the current value, preserving a
          separate recovery copy first.
        </Txt>
        <AsyncButton
          title="Export raw recovery data"
          action={async () => {
            const keys = (await AsyncStorage.getAllKeys()).filter(
              (k) =>
                k.startsWith("gas:") ||
                [
                  "anesthesia_case_logs",
                  "anesthesia_acgme_requirements",
                  "anesthesia_checklist_state",
                ].includes(k),
            );
            const raw = Object.fromEntries(
              await Promise.all(
                keys.map(async (k) => [k, await AsyncStorage.getItem(k)]),
              ),
            );
            await exportText(
              "gas-raw-recovery.json",
              JSON.stringify(raw, null, 2),
            );
          }}
        />
      </Accordion>
      <Recovery />
      {message && <Notice>{message}</Notice>}
      <Heading>About this build</Heading>
      <Txt>Gas Anesthesia • {contentVersion}</Txt>
      <Txt>
        {reviewStatus}. For trained anesthesia professionals. No clinical
        certification, regulatory clearance or institutional endorsement is
        implied.
      </Txt>
      <Heading>Privacy</Heading>
      <Txt>
        Cases, preferences and checklist state are stored locally with
        AsyncStorage, which is not encrypted storage. Do not enter patient
        identifiers. Device backups and shared exports may retain data.
        Reference links open external sites. Native SDK, backup and network
        behavior require release-specific verification; this build does not
        promise zero transmission or PHI compliance.
      </Txt>
      <Txt>
        No account or cloud sync is implemented. Offline references are bundled;
        opening source links requires a connection. The app does not provide
        patient-specific AI recommendations.
      </Txt>
    </Screen>
  );
}

export default function Settings() {
  const { loaded } = useStore(preferencesStore);
  return loaded ? (
    <SettingsForm />
  ) : (
    <Screen title="Loading preferences" back>
      <Txt>Checking local storage…</Txt>
    </Screen>
  );
}
