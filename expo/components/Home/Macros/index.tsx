import { View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useHealth } from "@/context/HealthContext";
import { macrosToCalories } from "@/helper";

import useMacros from "@/hooks/useMacros";
import userData from "@/queries/userData";

import Progress from "@/components/Progress";
import HomeMacrosProgress from "./Progress";

import language from "@/language";
import variables from "@/variables";

type HomeMacrosProps = {
  date: Date;
};

export default function HomeMacros({ date }: HomeMacrosProps) {
  // It would be preferable to use suspense here but I don't have time to implement a suspense state
  const { data } = useQuery(userData());
  const { active } = useHealth();

  const macrosConsumed = useMacros(date);
  const macrosTarget = data
    ? macrosToCalories(data.macro, data.calories)
    : { calories: 0, fat: 0, carbs: 0, protein: 0 };

  return (
    <View style={{ gap: variables.gap.normal }}>
      <HomeMacrosProgress
        target={macrosTarget.calories}
        burned={data ? active || 0 : 0}
        consumed={data ? macrosConsumed.calories : 0}
      />

      <View
        style={{
          gap: variables.gap.normal,

          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Progress
          color={variables.macros.protein.border}
          label={language.macros.protein.short}
          value={data ? macrosConsumed.protein : 0}
          target={macrosTarget.protein}
          style={{ maxWidth: 96 }}
        />

        <Progress
          color={variables.macros.carbs.border}
          label={language.macros.carbs.short}
          value={data ? macrosConsumed.carbs : 0}
          target={macrosTarget.carbs}
          style={{ maxWidth: 96 }}
        />

        <Progress
          color={variables.macros.fats.background}
          label={language.macros.fats.short}
          value={data ? macrosConsumed.fat : 0}
          target={macrosTarget.fat}
          style={{ maxWidth: 96 }}
        />
      </View>
    </View>
  );
}
