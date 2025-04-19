import { View } from "react-native";

import CameraShortcutsButton from "./Button";
import { useRouter } from "expo-router";

type CameraShortcutsProps = {
  flash: boolean;

  onFlash: () => void;
};

export default function CameraShortcuts({
  flash,
  onFlash,
}: CameraShortcutsProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

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
      <CameraShortcutsButton
        iconAwesome="arrow-left"
        onPress={handleBack}
        expand
      />

      <CameraShortcutsButton iconAwesome="question" onPress={() => {}} />

      <CameraShortcutsButton
        iconMaterial={flash ? "flashlight-on" : "flashlight-off"}
        onPress={onFlash}
      />
    </View>
  );
}
