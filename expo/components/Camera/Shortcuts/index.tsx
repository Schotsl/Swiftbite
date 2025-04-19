import { View } from "react-native";

import CameraShortcutsButton from "./Button";

export default function CameraShortcuts() {
  return (
    <View
      style={{
        gap: 16,
        width: "100%",
        padding: 32,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <CameraShortcutsButton icon="arrow-left" onPress={() => {}} expand />
      <CameraShortcutsButton icon="question" onPress={() => {}} />
      <CameraShortcutsButton icon="bolt-lightning" onPress={() => {}} />
    </View>
  );
}
