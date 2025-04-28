import Progress from "@/components/Progress";
import userData from "@/queries/userData";

import { Macros } from "@/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Fragment, Suspense } from "react";
import { View, Text, ActivityIndicator } from "react-native";

type ProductImpactProps = Macros;

export default function ProductImpact({
  fat,
  carbs,
  protein,
  calories,
}: ProductImpactProps) {
  const { data } = useSuspenseQuery(userData());
  const { macro } = data!;

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
                target={macro!.calories}
                type="kcal"
              />

              <Progress
                label="Eiwitten"
                value={protein}
                target={macro.protein}
              />
            </View>

            <View
              style={{
                gap: 16,
                flexDirection: "row",
              }}
            >
              <Progress label="Carbs" value={carbs} target={macro.carbs} />

              <Progress label="Vetten" value={fat} target={macro.fat} />
            </View>
          </Fragment>
        </Suspense>
      </View>
    </View>
  );
}
