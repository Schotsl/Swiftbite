import variables from "@/variables";
import { LinearGradient } from "expo-linear-gradient";

export default function DecorativeLinear() {
  return (
    <LinearGradient
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 1 }}
      colors={[variables.colors.primary, variables.colors.primaryGradient]}
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: "absolute",
      }}
    />
  );
}
