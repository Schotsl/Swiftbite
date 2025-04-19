import { TouchableOpacity, View } from "react-native";

type CameraControlsCircleProps = {
  onPress: () => void;
};

export default function CameraControlsCircle({
  onPress,
}: CameraControlsCircleProps) {
  return (
    <TouchableOpacity>
      <View
        style={{
          borderColor: "#ffffff",
          borderWidth: 2,
          borderRadius: 100,
        }}
      >
        <View
          style={{
            padding: 2,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: 100,
          }}
        >
          <View
            style={{
              width: 74,
              height: 74,
              backgroundColor: "#ffffff",
              borderRadius: 100,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
