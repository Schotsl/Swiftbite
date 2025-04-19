import { Text, View } from "react-native";
import { Divider } from "@/components/Divider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEditMeal } from "@/context/MealContext";
import { SwipeListView } from "react-native-swipe-list-view";
import { useForm } from "react-hook-form";

import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Label from "@/components/Label";
import Item from "@/components/Item";
import ItemDelete from "@/components/Item/Delete";
import useDeleteMeal from "@/mutations/useDeleteMeal";
import { MealData, mealSchema } from "@/schemas/serving";
import { zodResolver } from "@hookform/resolvers/zod";

export default function DetailsScreen() {
  const router = useRouter();

  const deleteMeal = useDeleteMeal();

  const { meal: mealId } = useLocalSearchParams<{ meal: string }>();
  const { meal, removeMealProduct, saveChanges } = useEditMeal();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<MealData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      title: meal?.title || "",
    },
  });

  const handleSave = async (data: MealData) => {
    await saveChanges(data);

    router.replace("/(tabs)/automations");
  };

  const handleDelete = async () => {
    await deleteMeal.mutateAsync(mealId);

    router.replace("/(tabs)/automations");
  };

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

      <View style={{ gap: 48, width: "100%" }}>
        <View style={{ gap: 32 }}>
          <Input
            name="title"
            control={control}
            label="Titel"
            placeholder="Maaltijd titel"
          />

          <View>
            <Label label="Ingrediënten" />

            <SwipeListView
              style={{
                width: "100%",
                flexDirection: "column",
                borderWidth: 2,
                borderColor: "#000000",
                borderRadius: 8,
              }}
              data={meal?.meal_product}
              keyExtractor={(item) => item.product_id}
              renderItem={({ item, index }) => {
                const length = meal?.meal_product.length || 0;

                const quantity = item.quantity || 0;
                const multiplier = item.product.calorie_100g || 0;

                const calories = (multiplier / 100) * quantity;
                const caloriesRounded = Math.round(calories);

                return (
                  <Item
                    small
                    key={item.product_id}
                    href={`/(tabs)/automations/meal/${item.meal_id}/product/${item.product_id}`}
                    border={index !== length - 1}
                    title={item.product.title!}
                    subtitle={`${caloriesRounded} kcal`}
                    rightTop={`1 kom (100g)`}
                  />
                );
              }}
              ListEmptyComponent={() => (
                <View
                  style={{
                    height: 80,
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      opacity: 0.25,
                      maxWidth: 200,
                      textAlign: "center",

                      fontSize: 14,
                      fontWeight: "semibold",
                    }}
                  >
                    Nog geen ingrediënten toegevoegd
                  </Text>
                </View>
              )}
              renderHiddenItem={({ item, index }) => {
                const length = meal?.meal_product.length || 0;
                return (
                  <ItemDelete
                    border={index !== length - 1}
                    onDelete={() => removeMealProduct(item.product_id)}
                  />
                );
              }}
              onRowDidOpen={(rowKey, rowMap) => {
                setTimeout(() => {
                  rowMap[rowKey]?.closeRow();
                }, 500);
              }}
              rightOpenValue={-75}
              useNativeDriver
              disableRightSwipe
            />
          </View>

          <View style={{ gap: 24 }}>
            <Button
              title="Voeg ingrediënt toe"
              onPress={() => {
                router.push(
                  `/(tabs)/automations/meal/${mealId}/product/search`
                );
              }}
            />

            <Button
              title="Wijzigingen opslaan"
              onPress={handleSubmit(handleSave)}
              disabled={isSubmitting}
              loading={isSubmitting}
            />

            <Divider />

            <Button
              title="Verwijder maaltijd"
              action="delete"
              onPress={handleDelete}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
