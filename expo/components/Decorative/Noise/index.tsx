import { ImageBackground } from "react-native";

export default function DecorativeNoise() {
  return (
    <ImageBackground
      source={require("@/assets/images/noise.png")}
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        opacity: 0.08,
        position: "absolute",
      }}
      resizeMode="repeat"
    />
  );
}
