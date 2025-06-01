import DecorativeNoise from "@/components/Decorative/Noise";

import variables from "@/variables";

import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

type CameraControlsSquareProps = {
  icon: keyof typeof FontAwesome6.glyphMap;

  onPress: () => void;
};

export default function CameraControlsSquare({
  icon,

  onPress,
}: CameraControlsSquareProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          width: 60,
          height: 60,
          borderColor: variables.colors.white,
          borderWidth: variables.border.width,
          borderRadius: variables.border.radius,

          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <FontAwesome6 name={icon} size={20} color={variables.colors.white} />

        <DecorativeNoise />
      </View>
    </TouchableOpacity>
  );
}
