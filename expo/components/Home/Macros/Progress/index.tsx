import { View } from "react-native";

import HomeProgressCircle from "./Circle";
import HomeProgressLabel from "./Label";

type HomeMacrosProgressProps = {
  target: number;
  burned: number;
  consumed: number;
};

export default function HomeMacrosProgress({
  target,
  burned,
  consumed,
}: HomeMacrosProgressProps) {
  const progress = consumed / target;

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <View
        style={{
          top: 24,
          width: "100%",
          zIndex: 1,
          position: "absolute",

          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <HomeProgressLabel value={consumed} label="consumed" />
        <HomeProgressLabel value={target - consumed} label="remaining" />
        <HomeProgressLabel value={burned} label="burned" />
      </View>

      <HomeProgressCircle progress={progress} />
    </View>
  );
}
