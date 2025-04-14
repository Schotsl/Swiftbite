import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import Button from "@/components/Button";
import { Divider } from "@/components/Divider";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Item from "@/components/Item";
import Label from "@/components/Label";
import mealData from "@/queries/mealData";

export default function DetailsScreen() {
  const { meal: mealId } = useLocalSearchParams();
  const { data } = useSuspenseQuery({
    ...mealData(),
    select: (data) => data.find((meal) => meal.uuid === mealId),
  });

  return (
    <View
      style={{
        flex: 1,
        padding: 32,
        alignItems: "flex-start",
        backgroundColor: "#fff",
      }}
    >
      <Header title="Bewerk maaltijd" />

      <View style={{ gap: 48 }}>
        <View style={{ gap: 32 }}>
          <Input
            name="title"
            value={data?.title}
            label="Titel"
            placeholder="Maaltijd titel"
          />

          <View>
            <Label label="Ingrediënten" />

            <View
              style={{
                width: "100%",
                flexDirection: "column",
                borderWidth: 2,
                borderColor: "#000000",
                borderRadius: 8,
              }}
            >
              {data?.meal_product.map((product) => {
                const quantity = product.quantity || 0;
                const multiplier = product.product.calorie_100g || 0;

                const calories = (multiplier / 100) * quantity;
                const caloriesRounded = Math.round(calories);

                return (
                  <Item
                    small
                    href={`/(tabs)/automations/meal/${product.meal_id}/product/${product.product_id}`}
                    border={false}
                    title={product.product.title!}
                    subtitle={`${caloriesRounded} kcal`}
                    rightTop={`1 kom (100g)`}
                  />
                );
              })}
            </View>
          </View>

          <View style={{ gap: 24 }}>
            <Button title="Voeg ingrediënt toe" onPress={() => {}} />

            <Divider />

            <Button
              title="Verwijder maaltijd"
              action="delete"
              onPress={() => {}}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
