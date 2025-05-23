import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

export default function CameraSelectorGradient() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      <LinearGradient
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
        style={{ width: 150 }}
        colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,1)"]}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      ></View>

      <LinearGradient
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
        style={{ width: 150 }}
        colors={["rgba(255,255,255,1)", "rgba(255,255,255,0.25)"]}
      />
    </View>
  );
}
