import React from "react";
import { useRouter } from "expo-router";
import { Screen, Txt, Button } from "../components/ui";
export default function Missing() {
  const router = useRouter();
  return (
    <Screen title="Page not found">
      <Txt>
        The reference may have moved. Search the current bundled library.
      </Txt>
      <Button
        title="Open library"
        onPress={() => router.replace("/(tabs)/library")}
      />
    </Screen>
  );
}
