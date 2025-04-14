import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { View } from "react-native";

import ItemNew from "@/components/ItemNew";
import mealData from "@/queries/mealData";

export default function Tab() {
  const { data } = useSuspenseQuery({
    ...mealData(),
  });

  return (
    <View
      style={{
        width: "100%",
        borderWidth: 2,
        borderColor: "#000000",
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        flexDirection: "column",
      }}
    >
      {data.map((meal) => (
        <Link href={`/(tabs)/automations/meal/${meal.uuid}`} key={meal.uuid}>
          <ItemNew
            title={meal.title}
            subtitle={`${meal.meal_product.length} ingrediënten`}
            iconId={meal.icon_id}
            rightBottom={`420 kcal`}
            subtitleIcon="bowl-food"
            // rightBottom={`${meal.meal_product.length} ingrediënten`}
          />
        </Link>
      ))}
    </View>
  );
}
