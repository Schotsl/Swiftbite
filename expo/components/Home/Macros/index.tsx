import { View } from "react-native";
import { useHealth } from "@/context/HealthContext";

import Progress from "@/components/Progress";
import useMacros from "@/hooks/useMacros";
import HomeMacrosProgress from "./Progress";

export default function HomeMacros() {
  const macros = useMacros();

  const { active } = useHealth();

  return (
    <View style={{ gap: 16, paddingVertical: 24 }}>
      <HomeMacrosProgress
        target={3200}
        burned={active || 0}
        consumed={macros.calories}
      />

      <View
        style={{
          gap: 16,
          width: "100%",

          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Progress
          label="Eiwitten"
          value={macros.protein}
          style={{ maxWidth: 96 }}
          target={180}
        />

        <Progress
          label="Carbs"
          value={macros.carbs}
          style={{ maxWidth: 96 }}
          target={450}
        />

        <Progress
          label="Vetten"
          value={macros.fat}
          style={{ maxWidth: 96 }}
          target={85}
        />
      </View>
    </View>
  );
}
