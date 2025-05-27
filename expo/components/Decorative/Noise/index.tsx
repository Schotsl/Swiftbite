import { Image } from "expo-image";
import { View } from "react-native";

export default function DecorativeNoise() {
  return (
    <View
      style={{
        width: 500,
        height: 500,
        position: "absolute",
        flexWrap: "wrap",
      }}
    >
      <DecorativeTile />
      <DecorativeTile />
      <DecorativeTile />
      <DecorativeTile />
    </View>
  );
}

export function DecorativeTile() {
  return (
    <View
      style={{
        width: 250,
        height: 250,
        opacity: 0.06,
      }}
    >
      <Image
        source={require("@/assets/images/noise.png")}
        contentFit="cover"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
}
