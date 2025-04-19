import { View } from "react-native";
import HomeProgressCircle from "./Circle";
import HomeProgressLabel from "./Label";

type HomeProgressProps = {
  target: number;
  burned: number;
  consumed: number;
};

export default function HomeProgress({
  target,
  burned,
  consumed,
}: HomeProgressProps) {
  const progress = (consumed / target) * 100;

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <View
        style={{
          top: 22,
          width: "100%",
          zIndex: 1,
          position: "absolute",

          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <HomeProgressLabel value={100} label="consumed" />
        <HomeProgressLabel value={100} label="remaining" />
        <HomeProgressLabel value={100} label="burned" />
      </View>

      <HomeProgressCircle progress={progress} />
    </View>
  );
}
