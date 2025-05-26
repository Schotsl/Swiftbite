import variables from "@/variables";
import { TouchableOpacity, View } from "react-native";

type CameraControlsCircleProps = {
  onPress: () => void;
};

export default function CameraControlsCircle({
  onPress,
}: CameraControlsCircleProps) {
  return (
    <TouchableOpacity
      style={{
        borderColor: variables.border.color,
        borderWidth: variables.border.width,
        borderRadius: 64,
      }}
      onPress={onPress}
    >
      <View
        style={{
          padding: 2,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: 64,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 60,
            backgroundColor: variables.colors.white,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
