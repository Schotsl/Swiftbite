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
        paddingHorizontal: 32,
        paddingTop: 72,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <ButtonSmall
        icon="arrow-left"
        color="#fff"
        style={{
          marginRight: "auto",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onPress={handleBack}
      />

      <ButtonSmall
        color="#fff"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        iconMaterial={flash ? "flashlight-on" : "flashlight-off"}
        onPress={onFlash}
      />
    </View>
  );
}
