import Progress from "@/components/Progress";
import { macroToAbsolute } from "@/helper";
import userData from "@/queries/userData";

import { Macro } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment, Suspense } from "react";
import { View, Text, ActivityIndicator } from "react-native";

type ProductImpactProps = Macro;

export default function ProductImpact({
  fat,
  carbs,
  protein,
  calories,
}: ProductImpactProps) {
  const { data } = useSuspenseQuery(userData());
  const { calories: userCalories, macro: userMacro } = data!;

  const macrosAbsolute = macroToAbsolute(userMacro, userCalories);

  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "OpenSans_600SemiBold",
          marginBottom: 16,
        }}
      >
        Impact op je budget
      </Text>

      <View
        style={{
          gap: 16,
          height: 186,
          padding: 16,

          borderWidth: 2,
          borderColor: "#000",
          borderRadius: 8,

          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Suspense fallback={<ActivityIndicator size="small" color="#000" />}>
          <Fragment>
            <View
              style={{
                gap: 16,
                flexDirection: "row",
              }}
            >
              <Progress
                label="Calorieën"
                value={calories}
                target={macrosAbsolute.calories}
                type="kcal"
              />

              <Progress
                label="Eiwitten"
                value={protein}
                target={macrosAbsolute.protein}
              />
            </View>

            <View
              style={{
                gap: 16,
                flexDirection: "row",
              }}
            >
              <Progress
                label="Carbs"
                value={carbs}
                target={macrosAbsolute.carbs}
              />

              <Progress
                label="Vetten"
                value={fat}
                target={macrosAbsolute.fat}
              />
            </View>
          </Fragment>
        </Suspense>
      </View>
    </View>
  );
}
