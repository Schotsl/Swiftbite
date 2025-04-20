import { View } from "react-native";
import { useRouter } from "expo-router";

import ButtonSmall from "@/components/Button/Small";

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
      <ButtonSmall
        icon="arrow-left"
        style={{
          marginRight: "auto",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onPress={handleBack}
      />

      <ButtonSmall
        icon="question"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onPress={() => {}}
      />

      <ButtonSmall
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        iconMaterial={flash ? "flashlight-on" : "flashlight-off"}
        onPress={onFlash}
      />
    </View>
  );
}
