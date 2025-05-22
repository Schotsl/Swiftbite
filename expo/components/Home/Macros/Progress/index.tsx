// HAPPY

import { View } from "react-native";

import HomeProgressCircle from "./Circle";
import HomeProgressLabel from "./Label";

import language from "@/language";
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
          top: 4,
          width: "100%",
          height: "100%",
          zIndex: 1,
          position: "absolute",

          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <HomeProgressLabel value={consumed} label={language.consumed} />

        <HomeProgressLabel
          value={target - consumed}
          label={language.remaining}
        />

        <HomeProgressLabel value={burned} label={language.burned} />
      </View>

      <HomeProgressCircle progress={progress} />
    </View>
  );
}
