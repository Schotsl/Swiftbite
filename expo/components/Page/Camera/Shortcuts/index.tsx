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
        paddingTop: 48,
        paddingBottom: 16,
        paddingHorizontal: 32,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
      }}
    >
      <ButtonSmall
        icon="arrow-left"
        color="#fff"
        style={{
          marginRight: "auto",
          // backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        action="tertiary"
        onPress={handleBack}
      />

      <ButtonSmall
        color="#fff"
        // style={{
        //   backgroundColor: "rgba(0, 0, 0, 0.5)",
        // }}
        action="tertiary"
        iconMaterial={flash ? "flashlight-on" : "flashlight-off"}
        onPress={onFlash}
      />
    </View>
  );
}
