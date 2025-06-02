// HAPPY

import { View } from "react-native";

import HomeProgressLabel from "./Label";
import HomeMacrosProgressCircle from "./Circle";

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
  const progressUnlimited = consumed / target;
  const progress = Math.min(progressUnlimited, 1);

  const remainingUnlimited = target - consumed;
  const remaining = Math.abs(remainingUnlimited);

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
          value={remaining}
          label={
            remainingUnlimited > 0 ? language.remaining : language.overflow
          }
        />

        <HomeProgressLabel value={burned} label={language.burned} />
      </View>

      <HomeMacrosProgressCircle progress={progress} />
    </View>
  );
}
