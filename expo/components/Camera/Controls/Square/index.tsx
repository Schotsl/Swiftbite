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
          width: 58,
          height: 58,
          borderColor: "#ffffff",
          borderWidth: 2,
          borderRadius: 8,

          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <FontAwesome6 name={icon} size={24} color="#ffffff" />
      </View>
    </TouchableOpacity>
  );
}
