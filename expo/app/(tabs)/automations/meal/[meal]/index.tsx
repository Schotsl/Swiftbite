import { Divider } from "@/components/Divider";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditMeal } from "@/context/MealContext";
import { SwipeListView } from "react-native-swipe-list-view";
import { MealData, mealSchema } from "@/schemas/serving";
import { useLocalSearchParams, useRouter } from "expo-router";

import Button from "@/components/Button";
import Header from "@/components/Header";
import Input from "@/components/Input";
import InputLabel from "@/components/Input/Label";
import ItemDelete from "@/components/Item/Delete";
import useDeleteMeal from "@/mutations/useDeleteMeal";
import ItemProductWithServing from "@/components/Item/ProductWithServing";

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
            <InputLabel label="Ingrediënten" />

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
                const serving = {
                  gram: item.selected_gram!,
                  option: item.selected_option!,
                  quantity: item.selected_quantity!,
                };

                return (
                  <ItemProductWithServing
                    icon={false}
                    border={index !== length - 1}
                    product={item.product}
                    serving={serving}
                    onPress={() => {
                      router.push({
                        pathname: `/(tabs)/automations/meal/[meal]/product`,
                        params: {
                          meal: item.meal_id,
                          product: item.product_id,
                        },
                      });
                    }}
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
                router.push(`/(tabs)/automations/meal/${mealId}/search`);
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
